import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { DayBusinessHour } from '../../src/api/endpoints/merchants';
import { extractErrorMessage } from '../../src/api/client';
import { BusinessHoursEditor } from '../../src/components/BusinessHoursEditor';
import { FilterChip } from '../../src/components/ui/Chip';
import { PhotoPlaceholder } from '../../src/components/ui/PhotoPlaceholder';
import { useMyMerchantProfile, useUpdatePhoneVisibility } from '../../src/hooks/useMerchant';
import { useCreatePost } from '../../src/hooks/usePosts';

const TEMPLATES = ['Còn hàng', 'Hết hàng hôm nay', 'Nghỉ bán', 'Khuyến mãi mới'];

const PHONE_MODE_MAP: Record<string, 'always' | 'business_hours' | 'hidden'> = {
  'Luôn hiện': 'always',
  'Giờ hành chính': 'business_hours',
  Ẩn: 'hidden',
};
const PHONE_MODE_LABEL: Record<'always' | 'business_hours' | 'hidden', string> = {
  always: 'Luôn hiện',
  business_hours: 'Giờ hành chính',
  hidden: 'Ẩn',
};

// on.merchantQuick — cập nhật nhanh, ẩn sau 24 giờ, chọn hiện SĐT/Zalo (tai-lieu-chuc-nang.md #41).
// Trước đây nút "Đăng cập nhật" chỉ điều hướng, không gọi API nào — nay đăng bài postType='merchant'
// thật (GPS thật lúc bấm, giống mọi luồng đăng bài khác) + áp dụng chế độ hiện SĐT/Zalo đã chọn.
// "Giờ hành chính" trước đây chỉ hiện đồng hồ đếm ngược GIẢ, không gửi khung giờ nào lên server — nay
// cho chọn lịch THẬT theo từng ngày trong tuần (tai-lieu-chuc-nang.md #43), qua `BusinessHoursEditor`.
export default function MerchantQuickUpdateScreen() {
  const [text, setText] = useState('');
  const [phoneMode, setPhoneMode] = useState('Ẩn');
  const [zalo, setZalo] = useState(false);
  const [businessHours, setBusinessHours] = useState<DayBusinessHour[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const createPost = useCreatePost();
  const updatePhoneVisibility = useUpdatePhoneVisibility();
  const { data: merchant } = useMyMerchantProfile();

  // Nạp lại lựa chọn đã lưu trước đó (nếu có) — cùng convention với profile/edit.tsx (useEffect nạp
  // 1 lần khi query trả về, không phải nguồn sự thật liên tục).
  useEffect(() => {
    if (!merchant) return;
    setPhoneMode(PHONE_MODE_LABEL[merchant.phoneVisibility]);
    setZalo(merchant.zaloEnabled);
    setBusinessHours(merchant.businessHours);
  }, [merchant]);

  const onSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Cần quyền vị trí để đăng cập nhật');
      const pos = await Location.getCurrentPositionAsync({});
      await createPost.mutateAsync({
        postType: 'merchant',
        content: text.trim(),
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        displayMode: 'alias',
        isMockLocation: pos.mocked ?? false,
      });
      const visibility = PHONE_MODE_MAP[phoneMode];
      await updatePhoneVisibility.mutateAsync({
        phoneVisibility: visibility,
        zaloEnabled: zalo,
        ...(visibility === 'business_hours' ? { businessHours } : {}),
      });
      router.replace('/(main)/merchant');
    } catch (err) {
      setError(await extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Cập nhật nhanh</Text>
        <View className="flex-1" />
        <Text className="font-mono-medium text-[11px] text-accent-text">ẨN SAU 24G</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="font-mono-medium text-xs tracking-wide text-muted">MẪU CÓ SẴN</Text>
        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <FilterChip key={t} label={t} onPress={() => setText(t)} />
          ))}
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Viết cập nhật…"
          placeholderTextColor="#a8a297"
          multiline
          className="mt-4 rounded-2xl border-[1.5px] border-primary bg-white p-3.5 min-h-[96px] text-[15px] leading-[22px] text-ink"
        />

        <Text className="mt-4 font-mono-medium text-xs tracking-wide text-muted">HIỆN SỐ ĐIỆN THOẠI / ZALO</Text>
        <View className="mt-2.5 flex-row gap-1.5">
          {['Luôn hiện', 'Giờ hành chính', 'Ẩn'].map((m) => (
            <FilterChip key={m} label={m} selected={phoneMode === m} onPress={() => setPhoneMode(m)} />
          ))}
        </View>
        <Text className="mt-2.5 text-xs leading-[19px] text-muted">
          {phoneMode === 'Ẩn' ? 'Khách chỉ nhắn hỏi qua app.' : 'Số điện thoại hiện trực tiếp trên bài đăng.'}
        </Text>

        {phoneMode !== 'Ẩn' ? (
          <>
            {phoneMode === 'Giờ hành chính' ? (
              <>
                <Text className="mt-2.5 text-[11.5px] text-muted">
                  Bật ngày nào, chọn giờ mở/đóng ngày đó — ngày không bật coi như ẩn số cả ngày.
                </Text>
                <View className="mt-1.5">
                  <BusinessHoursEditor value={businessHours} onChange={setBusinessHours} />
                </View>
              </>
            ) : (
              <View className="mt-2.5 rounded-[13px] bg-accent-50 border border-accent-200 px-3.5 py-3">
                <Text className="text-[12.5px] leading-[19px] text-accent-text">
                  Số điện thoại tài khoản của bạn sẽ hiện trên bài đăng này, mọi lúc, cho tới khi bạn đổi lại.
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setZalo((z) => !z)}
              className="mt-2.5 flex-row items-center gap-3 rounded-[13px] border border-border bg-white px-3.5 py-3"
            >
              <View className="flex-1">
                <Text className="font-sans-semibold text-[13.5px] text-ink">Kèm Zalo cùng số</Text>
                <Text className="text-[11.5px] text-muted mt-0.5">Khách bấm là mở Zalo, ẩn cùng lúc với số</Text>
              </View>
              <View className={`w-11 h-6 rounded-full p-0.5 ${zalo ? 'bg-primary' : 'bg-border'}`}>
                <View className={`w-5 h-5 rounded-full bg-white ${zalo ? 'ml-5' : 'ml-0'}`} />
              </View>
            </Pressable>
          </>
        ) : null}

        <View className="mt-2.5 flex-row items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3">
          <PhotoPlaceholder style={{ width: 44, height: 44, borderRadius: 10 }} />
          <Text className="flex-1 text-xs leading-[18px] text-muted">Ảnh vẫn phải chụp tại quán ngay lúc đăng</Text>
          <Pressable
            onPress={() => router.push('/post/create/camera')}
            className="h-8 rounded-lg border border-border bg-white px-3 items-center justify-center"
          >
            <Text className="font-sans-semibold text-xs text-ink">Chụp</Text>
          </Pressable>
        </View>
      </ScrollView>

      {error ? <Text className="px-4.5 pb-2 text-[12.5px] text-danger-text">{error}</Text> : null}

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable
          onPress={() => void onSubmit()}
          disabled={!text.trim() || submitting}
          className={`h-[52px] rounded-2xl bg-ink items-center justify-center ${!text.trim() || submitting ? 'opacity-50' : ''}`}
        >
          <Text className="font-sans-semibold text-[15.5px] text-white">
            {submitting ? 'Đang đăng…' : 'Đăng cập nhật'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
