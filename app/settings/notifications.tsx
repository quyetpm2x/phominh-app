import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../src/components/ui/Chip';
import { useNotificationSettings, useUpdateNotificationSettings } from '../../src/hooks/useNotifications';

const FREQS: { label: string; value: 'daily' | 'weekly' | 'emergency_only' }[] = [
  { label: 'Hàng ngày', value: 'daily' },
  { label: 'Hàng tuần', value: 'weekly' },
  { label: 'Chỉ khẩn cấp', value: 'emergency_only' },
];

// on.notifSettings — tần suất bản tin, loại thông báo, giờ yên tĩnh (mục 48).
export default function NotifSettingsScreen() {
  const { data: settings, isLoading } = useNotificationSettings();
  const updateSettings = useUpdateNotificationSettings();
  // "Nhắn hỏi mới" chưa có tính năng nhắn tin thật ở backend — giữ local-only, không gửi lên server.
  const [messagesLocalOnly, setMessagesLocalOnly] = useState(false);

  useEffect(() => {
    if (settings) setMessagesLocalOnly(false);
  }, [settings]);

  if (isLoading || !settings) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

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
            <FilterChip
              key={f.value}
              label={f.label}
              selected={settings.frequency === f.value}
              onPress={() => void updateSettings.mutateAsync({ frequency: f.value })}
            />
          ))}
        </View>
        <Text className="mt-2.5 text-xs leading-[19px] text-muted">
          Mặc định một lần mỗi tuần. Gửi dồn dập chỉ khiến người dùng tắt hết thông báo.
        </Text>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">NHẬN THÔNG BÁO CHO</Text>
        <View className="mt-2.5 gap-2.5">
          <ToggleRow
            label="Bình luận trên bài của tôi"
            on={settings.notifyComments}
            onToggle={() => void updateSettings.mutateAsync({ notifyComments: !settings.notifyComments })}
          />
          <ToggleRow label="Nhắn hỏi mới" on={messagesLocalOnly} onToggle={() => setMessagesLocalOnly((v) => !v)} />
        </View>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">GIỜ YÊN TĨNH</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white px-3.5 py-3 flex-row items-center">
          <Text className="flex-1 text-[13.5px] text-ink">Không làm phiền</Text>
          <Text className="font-mono-semibold text-[13px] text-ink">
            {settings.quietHoursStart ?? '22:00'} – {settings.quietHoursEnd ?? '07:00'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      className="rounded-[13px] border border-border bg-white px-3.5 py-3 flex-row items-center gap-3"
    >
      <Text className="flex-1 text-[13.5px] text-ink">{label}</Text>
      <View className={`w-11 h-6 rounded-full p-0.5 ${on ? 'bg-primary' : 'bg-border'}`}>
        <View className={`w-5 h-5 rounded-full bg-white ${on ? 'ml-5' : 'ml-0'}`} />
      </View>
    </Pressable>
  );
}
