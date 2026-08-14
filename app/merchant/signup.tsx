import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { TextInput } from '../../src/components/ui/TextInput';
import { useRegisterMerchant } from '../../src/hooks/useMerchant';

// on.merchantSignup — đăng ký tài khoản chủ quán (mục 39). ĐÃ BỎ bước chụp mặt tiền quán (quyết
// định đơn giản hoá) — điều kiện còn lại: SĐT đã xác thực OTP (có sẵn từ đăng nhập) + GPS thật lúc
// đăng ký (bắt buộc lấy từ thiết bị, không cho tự nhập toạ độ) → tự động duyệt ngay.
export default function MerchantSignupScreen() {
  const [businessName, setBusinessName] = useState('');
  const [addressText, setAddressText] = useState('Đang xác định vị trí…');
  const [category, setCategory] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const registerMerchant = useRegisterMerchant();

  useEffect(() => {
    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setAddressText('Chưa cấp quyền vị trí — không thể đăng ký');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const r = results[0];
        const line = [r?.street, r?.district || r?.subregion || r?.city].filter(Boolean).join(', ');
        setAddressText(line || 'Không xác định được địa chỉ');
      } catch {
        setAddressText('Không xác định được địa chỉ');
      }
    })();
  }, []);

  const canSubmit = businessName.trim().length > 0 && !!coords;

  const onSubmit = async () => {
    if (!canSubmit || !coords) return;
    setError(null);
    try {
      await registerMerchant.mutateAsync({
        businessName: businessName.trim(),
        addressText,
        lat: coords.lat,
        lng: coords.lng,
        category: category.trim() || undefined,
      });
      router.replace('/(main)/merchant');
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Tài khoản chủ quán</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-[22px] leading-[28px] font-sans-bold text-ink">
          Đăng tin cho khách ở gần, không tốn tiền quảng cáo
        </Text>
        <Text className="mt-2.5 text-[13.5px] leading-[21px] text-muted">
          Xác thực số điện thoại là đăng được ngay. Không cần tích điểm uy tín trước.
        </Text>

        <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">THÔNG TIN QUÁN</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <View className="px-3.5 py-3 border-b border-border-soft">
            <Text className="text-[11.5px] text-muted mb-1">Tên quán</Text>
            <TextInput
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="VD: Bún chả Hàng Quạt"
              className="h-9 px-0 border-0 text-[14.5px] font-sans-semibold"
            />
          </View>
          <View className="px-3.5 py-3 border-b border-border-soft flex-row items-center gap-2.5">
            {coords ? null : <ActivityIndicator size="small" />}
            <View className="flex-1">
              <Text className="text-[11.5px] text-muted">Địa chỉ (theo GPS lúc đăng ký)</Text>
              <Text className="mt-0.5 font-sans-semibold text-[14.5px] text-ink">{addressText}</Text>
            </View>
          </View>
          <View className="px-3.5 py-3">
            <Text className="text-[11.5px] text-muted mb-1">Ngành hàng (không bắt buộc)</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="VD: Quán ăn"
              className="h-9 px-0 border-0 text-[14.5px] font-sans-semibold"
            />
          </View>
        </View>

        <View className="mt-3.5 rounded-2xl bg-accent-50 border border-accent-200 p-3.5">
          <Text className="text-[12.5px] leading-[19px] text-accent-text">
            Giai đoạn thử nghiệm chưa có gói trả phí nào. Mọi tính năng thu phí chỉ bật sau khi có giấy phép mạng xã
            hội theo Nghị định 147/2024.
          </Text>
        </View>

        {error ? <Text className="mt-3 text-xs text-danger">{error}</Text> : null}

        <Pressable
          onPress={() => void onSubmit()}
          disabled={!canSubmit || registerMerchant.isPending}
          className={`mt-4 h-[52px] rounded-2xl items-center justify-center ${canSubmit ? 'bg-ink' : 'bg-border'}`}
        >
          <Text className={`font-sans-semibold text-[15.5px] ${canSubmit ? 'text-white' : 'text-muted'}`}>
            Kích hoạt tài khoản quán
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
