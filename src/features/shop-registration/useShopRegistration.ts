import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { PROFILE_STORAGE_KEY, restoreProfile } from '../../lib/personalProfile';

export function useShopRegistration() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [locating, setLocating] = useState(false);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');
  const locate = async () => {
    if (locating) return;
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Chưa có quyền vị trí', 'Bạn có thể nhập địa chỉ quán trực tiếp.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync(position.coords);
      const resolved =
        place &&
        [place.streetNumber, place.street, place.district, place.city, place.region]
          .filter(Boolean)
          .join(', ');
      if (resolved) setAddress(resolved);
      else Alert.alert('Chưa tìm được địa chỉ', 'Vui lòng nhập địa chỉ quán trực tiếp.');
    } catch {
      Alert.alert('Không thể định vị', 'Vui lòng thử lại hoặc nhập địa chỉ quán trực tiếp.');
    } finally {
      setLocating(false);
    }
  };
  const pickPhotos = async () => {
    if (picking || photos.length >= 5) return;
    setPicking(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 5 - photos.length,
        quality: 1,
      });
      if (result.canceled) return;
      const valid = result.assets.filter(
        (asset) => asset.fileSize !== undefined && asset.fileSize < 5 * 1024 * 1024,
      );
      if (valid.length !== result.assets.length)
        Alert.alert('Ảnh không hợp lệ', 'Chỉ nhận ảnh dưới 5MB và xác định được dung lượng.');
      setPhotos((previous) => [...previous, ...valid].slice(0, 5));
    } catch {
      Alert.alert('Không thể chọn ảnh', 'Vui lòng thử lại.');
    } finally {
      setPicking(false);
    }
  };
  const submit = async () => {
    if (!name.trim() || !category || !address.trim()) {
      setError('Vui lòng điền tên quán, ngành hàng và địa chỉ.');
      return;
    }
    if (!/^(?:0\d{9}|\+84\d{9})$/.test(phone.replace(/[\s.-]/g, ''))) {
      setError('Vui lòng nhập số điện thoại Việt Nam hợp lệ.');
      return;
    }
    setError('');
    try {
      const profile = restoreProfile(await SecureStore.getItemAsync(PROFILE_STORAGE_KEY));
      await SecureStore.setItemAsync(
        PROFILE_STORAGE_KEY,
        JSON.stringify({ ...profile, isShopRegistered: true }),
      );
      Alert.alert('Đăng ký thành công', 'Tài khoản đã được kích hoạt quyền Quán.', [
        { text: 'Tiếp tục', onPress: () => router.replace('/home') },
      ]);
    } catch {
      Alert.alert('Không thể lưu đăng ký', 'Vui lòng thử lại.');
    }
  };
  return {
    name,
    setName,
    category,
    setCategory,
    phone,
    setPhone,
    address,
    setAddress,
    photos,
    setPhotos,
    locating,
    locate,
    picking,
    pickPhotos,
    error,
    submit,
  };
}
