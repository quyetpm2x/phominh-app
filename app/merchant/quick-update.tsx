import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../src/components/ui/Chip';
import { PhotoPlaceholder } from '../../src/components/ui/PhotoPlaceholder';

const TEMPLATES = ['Còn hàng', 'Hết hàng hôm nay', 'Nghỉ bán', 'Khuyến mãi mới'];

// on.merchantQuick — cập nhật nhanh, ẩn sau 24 giờ, chọn hiện SĐT/Zalo.
export default function MerchantQuickUpdateScreen() {
  const [text, setText] = useState('');
  const [phoneMode, setPhoneMode] = useState('Ẩn');
  const [zalo, setZalo] = useState(false);

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
            <View className="mt-2.5 flex-row items-center gap-2.5 rounded-[13px] bg-accent-50 border border-accent-200 px-3.5 py-3">
              <Text className="flex-1 font-mono-semibold text-sm text-accent-text">0912 345 678</Text>
              <Text className="font-mono-medium text-[11px] text-accent-text">còn 23:58:00</Text>
            </View>
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

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable onPress={() => router.push('/(main)/merchant')} className="h-[52px] rounded-2xl bg-ink items-center justify-center">
          <Text className="font-sans-semibold text-[15.5px] text-white">Đăng cập nhật</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
