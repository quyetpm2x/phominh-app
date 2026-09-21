import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Alert, AppState, Linking } from 'react-native';
import { createCapturedPhoto, type CapturedPhoto, type CapturePlace } from './capturePhoto';

export function useCaptureCamera(camera: RefObject<CameraView | null>, place: CapturePlace | null) {
  const locked = useRef(false);
  const mounted = useRef(true);
  const [focused, setFocused] = useState(false);
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const [permission, requestPermission, refreshPermission] = useCameraPermissions();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
        setReady(false);
      };
    }, []),
  );

  useEffect(() => {
    mounted.current = true;
    CameraView.isAvailableAsync()
      .then((value) => {
        if (mounted.current) setAvailable(value);
      })
      .catch(() => {
        if (mounted.current) setAvailable(false);
      });
    const subscription = AppState.addEventListener('change', (state) => {
      setForeground(state === 'active');
      setReady(false);
      if (state === 'active') void refreshPermission().catch(() => {});
    });
    return () => {
      mounted.current = false;
      subscription.remove();
    };
  }, [refreshPermission]);

  const active = focused && foreground && permission?.granted && available && !photo && !error;
  async function grantAccess() {
    try {
      setError(null);
      if (permission && !permission.canAskAgain) await Linking.openSettings();
      else await requestPermission();
    } catch {
      setError('Không thể yêu cầu quyền camera. Vui lòng thử lại.');
    }
  }
  async function takePhoto() {
    if (locked.current || !ready || !active || !camera.current) return;
    locked.current = true;
    setBusy(true);
    const capturedAt = Date.now();
    try {
      const result = await camera.current.takePictureAsync({ quality: 0.9 });
      if (mounted.current && result?.uri)
        setPhoto(createCapturedPhoto(result.uri, 'camera', place, capturedAt));
    } catch {
      if (mounted.current) Alert.alert('Chưa chụp được ảnh', 'Vui lòng thử lại.');
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function choosePhoto() {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9,
        allowsMultipleSelection: false,
      });
      if (mounted.current && !result.canceled && result.assets[0])
        setPhoto(createCapturedPhoto(result.assets[0].uri, 'library', null));
    } catch {
      if (mounted.current)
        Alert.alert(
          'Không mở được thư viện',
          'Vui lòng kiểm tra quyền truy cập ảnh trong Cài đặt và thử lại.',
        );
    } finally {
      locked.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  function flip() {
    setReady(false);
    setFlash(false);
    setFacing((value) => (value === 'back' ? 'front' : 'back'));
  }
  function retake() {
    setReady(false);
    setPhoto(null);
  }
  return {
    permission,
    available,
    facing,
    flash,
    setFlash,
    ready,
    setReady,
    busy,
    error,
    setError,
    photo,
    active: Boolean(active),
    grantAccess,
    takePhoto,
    choosePhoto,
    flip,
    retake,
  };
}
