import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../../src/components/ui/Chip';
import { PhotoPlaceholder } from '../../../src/components/ui/PhotoPlaceholder';

const CHIPS = ['Còn hàng', 'Vừa xảy ra', 'Cảnh báo', 'Vui thôi'];

// on.quickCaption — thêm một dòng cho ảnh chụp nhanh, bỏ trống vẫn gửi được.
export default function QuickCaptionScreen() {
  const [text, setText] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-ink">
      <View className="h-11 flex-row items-center justify-between px-4">
        <Pressable onPress={() => router.replace('/post/create/quick')}>
          <Text className="text-white text-[14.5px]">Chụp lại</Text>
        </Pressable>
        <Text className="text-white font-sans-semibold text-[13.5px]">Thêm một dòng</Text>
        <View className="w-14" />
      </View>

      <PhotoPlaceholder label="chụp lúc 20:14 · Ngõ 4 Nguyễn Đình Chiểu" style={{ flex: 1, marginHorizontal: 12, marginTop: 6, borderRadius: 26 }}>
        <View className="absolute left-3.5 right-3.5 bottom-3.5 min-h-11 rounded-full bg-ink/60 justify-center px-4 py-2.5">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Thêm một dòng…"
            placeholderTextColor="rgba(255,255,255,.5)"
            className="text-white text-[14.5px]"
          />
        </View>
      </PhotoPlaceholder>

      <View className="px-4 pt-3 flex-row flex-wrap gap-1.5">
        {CHIPS.map((c) => (
          <FilterChip key={c} label={c} onPress={() => setText(c)} />
        ))}
      </View>

      <View className="px-4 pt-3.5 pb-3 flex-row gap-2.5 items-center">
        <Pressable
          onPress={() => router.push('/post/create/posted')}
          className="flex-1 h-[52px] rounded-full bg-cream items-center justify-center"
        >
          <Text className="font-sans-semibold text-[15.5px] text-ink">Đăng lên xóm</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/post/create/caption')}
          className="h-[52px] rounded-full border border-white/25 px-4 items-center justify-center"
        >
          <Text className="font-sans-semibold text-[13.5px] text-[#e9e6df]">Soạn đầy đủ</Text>
        </Pressable>
      </View>
      <Text className="px-6 pb-6 text-center text-[11.5px] leading-[17px] text-[#7d786d]">
        Bỏ trống dòng này cũng gửi được. Tin nhanh ẩn sau 12 giờ.
      </Text>
    </SafeAreaView>
  );
}
