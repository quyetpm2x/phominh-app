import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GradientButton } from '../../../src/components/ui/Button';

// on.voice — đăng bằng giọng nói, tự chuyển thành chữ, bản ghi âm gốc luôn đăng kèm.
export default function VoiceScreen() {
  const [recorded, setRecorded] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center justify-between px-3.5 border-b border-border">
        <Pressable onPress={() => router.back()}>
          <Text className="text-[15px] text-ink">Huỷ</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Đăng bằng giọng nói</Text>
        <View className="w-11" />
      </View>

      <ScrollView contentContainerClassName="px-4.5 pt-4.5">
        <Text className="text-[13.5px] leading-[21px] text-muted">
          Nói 5–10 giây, app tự chuyển thành chữ. Bản ghi âm gốc đăng kèm để hàng xóm nghe được đúng giọng bạn.
        </Text>

        <View className="mt-3.5 rounded-2xl bg-white border border-border p-3.5">
          <Waveform recorded={recorded} />
          <View className="mt-3 flex-row items-baseline justify-between">
            <Text className="font-mono-semibold text-[22px] text-ink">{recorded ? '0:07' : '0:00'}</Text>
            <Text className="font-mono-medium text-[11px] text-muted">{recorded ? 'đã ghi xong' : 'chạm để ghi'}</Text>
          </View>
        </View>

        {recorded ? (
          <>
            <View className="mt-3.5 rounded-[15px] border border-border bg-white p-3.5">
              <View className="flex-row items-center gap-2">
                <Text className="font-mono-medium text-[10.5px] text-primary">ĐÃ CHUYỂN THÀNH CHỮ</Text>
                <View className="flex-1" />
                <Text className="font-sans-semibold text-xs text-ink">Sửa</Text>
              </View>
              <Text className="mt-2 text-[15.5px] leading-[22px] text-ink/85">
                Còn năm suất bún hôm nay, ai qua sớm thì còn nhé cả nhà.
              </Text>
              <View className="mt-3 pt-3 border-t border-border-soft flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-full bg-ink items-center justify-center">
                  <Text className="text-white text-[10px]">▶</Text>
                </View>
                <Waveform recorded small />
                <Text className="font-mono-medium text-[11px] text-muted">0:07</Text>
              </View>
              <Text className="mt-2.5 text-[11.5px] leading-[17px] text-muted">
                Bản ghi âm gốc luôn đăng kèm — người nghe tự đối chiếu nếu máy nhận nhầm chữ.
              </Text>
            </View>
            <View className="mt-3 flex-row items-center gap-2.5 rounded-2xl bg-white border border-border px-3.5 py-3">
              <Text className="flex-1 text-xs text-muted">Thêm ảnh chụp tại chỗ (không bắt buộc)</Text>
              <Pressable
                onPress={() => router.push('/post/create/camera')}
                className="h-8 rounded-lg border border-border bg-white px-3 items-center justify-center"
              >
                <Text className="font-sans-semibold text-xs text-ink">Chụp</Text>
              </Pressable>
            </View>
          </>
        ) : null}
      </ScrollView>

      <View className="px-4.5 pt-2.5 pb-6 items-center gap-3">
        <Pressable
          onPress={() => setRecorded((v) => !v)}
          className={`w-[74px] h-[74px] rounded-full border-4 ${recorded ? 'border-primary bg-white' : 'border-danger bg-danger'}`}
        />
        {recorded ? <GradientButton label="Đăng tin này" className="w-full" onPress={() => router.push('/post/create/posted')} /> : null}
      </View>
    </SafeAreaView>
  );
}

function Waveform({ recorded, small }: { recorded: boolean; small?: boolean }) {
  const bars = [10, 22, 14, 30, 18, 26, 12, 20, 16, 24, 10, 28, 14];
  return (
    <View className={`flex-row items-center gap-0.5 ${small ? 'flex-1 h-[22px]' : 'h-14'}`}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={{ width: 2.5, height: recorded ? h : 4, borderRadius: 1.5, backgroundColor: '#c9c4b8' }}
        />
      ))}
    </View>
  );
}
