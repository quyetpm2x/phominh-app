import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, Linking, Platform } from 'react-native';

export type DevicePermission = 'location' | 'notifications' | 'camera';
type PermissionState = { granted: boolean; canAskAgain: boolean };
type PermissionMap = Record<DevicePermission, PermissionState | null>;

const readers = {
  location: Location.getForegroundPermissionsAsync,
  notifications: Notifications.getPermissionsAsync,
  camera: Camera.getCameraPermissionsAsync,
};

function normalize(permission: PermissionState & { ios?: { status: number } }): PermissionState {
  return {
    granted:
      permission.granted ||
      permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      permission.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL,
    canAskAgain: permission.canAskAgain,
  };
}

export function useDevicePermissions() {
  const [permissions, setPermissions] = useState<PermissionMap>({
    location: null,
    notifications: null,
    camera: null,
  });
  const [pending, setPending] = useState<DevicePermission | null>(null);
  const requesting = useRef(false);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const keys = Object.keys(readers) as DevicePermission[];
    const results = await Promise.allSettled(keys.map((key) => readers[key]()));
    if (!mounted.current) return;
    setPermissions((previous) => {
      const next = { ...previous };
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') next[keys[index]] = normalize(result.value);
      });
      return next;
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !requesting.current) void refresh();
    });
    return () => {
      mounted.current = false;
      subscription.remove();
    };
  }, [refresh]);

  const openSettings = () => {
    Alert.alert(
      'Cấp quyền trong Cài đặt',
      'Bạn có thể bật lại quyền truy cập cho Phố Mình trong phần Cài đặt của thiết bị.',
      [
        { text: 'Để sau', style: 'cancel' },
        {
          text: 'Mở Cài đặt',
          onPress: () => {
            void Linking.openSettings().catch(() =>
              Alert.alert('Không thể mở Cài đặt', 'Vui lòng mở Cài đặt của thiết bị và chọn Phố Mình.'),
            );
          },
        },
      ],
    );
  };

  const request = async (key: DevicePermission) => {
    if (requesting.current) return;
    requesting.current = true;
    setPending(key);
    try {
      const current = normalize(await readers[key]());
      if (mounted.current) setPermissions((previous) => ({ ...previous, [key]: current }));
      if (current.granted) return;
      if (!current.canAskAgain) {
        openSettings();
        return;
      }
      let result;
      if (key === 'location') result = await Location.requestForegroundPermissionsAsync();
      else if (key === 'camera') result = await Camera.requestCameraPermissionsAsync();
      else {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('neighborhood', {
            name: 'Tin khu phố',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }
        result = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        });
      }
      if (mounted.current) setPermissions((previous) => ({ ...previous, [key]: normalize(result) }));
    } catch {
      Alert.alert(
        'Chưa thể cấp quyền',
        'Vui lòng thử lại hoặc kiểm tra quyền truy cập trong Cài đặt của thiết bị.',
      );
    } finally {
      requesting.current = false;
      if (mounted.current) setPending(null);
    }
  };
  return { permissions, pending, request };
}
