import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../src/components/ui/Chip';

const FREQS = ['Hàng ngày', 'Hàng tuần', 'Chỉ khẩn cấp'];
const TOGGLES = ['Bản tin tuần', 'Tin khẩn cấp', 'Bình luận trên bài của tôi', 'Nhắn hỏi mới'];

// on.notifSettings — tần suất bản tin, loại thông báo, giờ yên tĩnh.
export default function NotifSettingsScreen() {
  const [freq, setFreq] = useState(FREQS[1]);
  const [on, setOn] = useState<Record<string, boolean>>({ [TOGGLES[0]]: true, [TOGGLES[1]]: true, [TOGGLES[2]]: true, [TOGGLES[3]]: false });

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Cài đặt thông báo</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="font-mono-medium text-xs tracking-wide text-muted">TẦN SUẤT BẢN TIN</Text>
        <View className="mt-2.5 flex-row gap-1.5">
          {FREQS.map((f) => (
            <FilterChip key={f} label={f} selected={freq === f} onPress={() => setFreq(f)} />
          ))}
        </View>
        <Text className="mt-2.5 text-xs leading-[19px] text-muted">
          Mặc định một lần mỗi tuần. Gửi dồn dập chỉ khiến người dùng tắt hết thông báo.
        </Text>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">NHẬN THÔNG BÁO CHO</Text>
        <View className="mt-2.5 gap-2.5">
          {TOGGLES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setOn((s) => ({ ...s, [t]: !s[t] }))}
              className="rounded-[13px] border border-border bg-white px-3.5 py-3 flex-row items-center gap-3"
            >
              <Text className="flex-1 text-[13.5px] text-ink">{t}</Text>
              <View className={`w-11 h-6 rounded-full p-0.5 ${on[t] ? 'bg-primary' : 'bg-border'}`}>
                <View className={`w-5 h-5 rounded-full bg-white ${on[t] ? 'ml-5' : 'ml-0'}`} />
              </View>
            </Pressable>
          ))}
        </View>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">GIỜ YÊN TĨNH</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white px-3.5 py-3 flex-row items-center">
          <Text className="flex-1 text-[13.5px] text-ink">Không làm phiền</Text>
          <Text className="font-mono-semibold text-[13px] text-ink">22:00 – 07:00</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
