import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../../src/components/ui/Avatar';

const SWATCHES = ['#1f6f52', '#c9a227', '#b8482a', '#17150f', '#5d5950'];

// on.status — trạng thái chữ, không cần ảnh.
export default function StatusScreen() {
  const [text, setText] = useState('');
  const [bg, setBg] = useState(SWATCHES[0]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center justify-between px-3.5 border-b border-border">
        <Pressable onPress={() => router.back()}>
          <Text className="text-[15px] text-ink">Huỷ</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Viết trạng thái</Text>
        <Pressable
          onPress={() => router.push('/post/create/posted')}
          className="h-8 rounded-lg bg-ink px-3.5 items-center justify-center"
        >
          <Text className="font-sans-semibold text-xs text-white">Đăng</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4">
        <View className="flex-row items-center gap-2.5">
          <Avatar initial="M" size={40} radius={13} />
          <View>
            <Text className="font-sans-semibold text-[14.5px] text-ink">Minh ở Times City</Text>
            <Text className="text-[11.5px] text-muted mt-0.5">Hiện cho hàng xóm trong 2 km · ẩn sau 48 giờ</Text>
          </View>
        </View>

        <View style={{ backgroundColor: bg }} className="mt-3.5 rounded-2xl min-h-[110px] p-4 justify-center">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Có chuyện gì quanh bạn?"
            placeholderTextColor="rgba(255,255,255,.6)"
            multiline
            className="text-white text-[17px] leading-[24px]"
          />
        </View>

        <View className="mt-3 flex-row items-center gap-2">
          <Text className="font-mono-medium text-xs tracking-wide text-muted">NỀN</Text>
          <View className="flex-row gap-1.5">
            {SWATCHES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setBg(c)}
                style={{ backgroundColor: c, borderWidth: bg === c ? 2 : 0, borderColor: '#fff' }}
                className="w-6 h-6 rounded-full"
              />
            ))}
          </View>
        </View>

        <View className="mt-3.5 rounded-2xl border border-border bg-white overflow-hidden">
          <View className="px-3.5 py-3 flex-row items-center gap-2.5 border-b border-border-soft">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <Text className="flex-1 text-[13.5px] text-ink">Ngõ 4 Nguyễn Đình Chiểu</Text>
            <Text className="text-[11.5px] text-muted">GPS lúc đăng</Text>
          </View>
          <View className="px-3.5 py-3 flex-row items-center">
            <Text className="flex-1 text-[13.5px] text-ink">Thêm ảnh hoặc video</Text>
            <Pressable
              onPress={() => router.push('/post/create/camera')}
              className="h-8 rounded-lg border border-border bg-white px-3 items-center justify-center"
            >
              <Text className="font-sans-semibold text-xs text-ink">Mở camera</Text>
            </Pressable>
          </View>
        </View>

        <Text className="mt-3 text-xs leading-[19px] text-muted">
          Trạng thái chữ không cần ảnh. Nhưng nếu bạn kể một sự việc vừa xảy ra, thêm ảnh chụp tại chỗ sẽ được hàng
          xóm tin hơn nhiều.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
