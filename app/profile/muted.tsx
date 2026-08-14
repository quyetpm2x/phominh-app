import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { useIgnoredUsers, useUnignoreUser } from '../../src/hooks/useIgnoredUsers';

// on.muted — "Không quan tâm" (mục 32, 38): ẩn bài của 1 người khỏi feed của chính mình, không phải
// chặn hẳn — không thông báo cho người bị ẩn.
export default function MutedScreen() {
  const { data: ignoredUsers, isLoading } = useIgnoredUsers();
  const unignoreUser = useUnignoreUser();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Không quan tâm</Text>
        <View className="flex-1" />
        <Text className="font-mono-medium text-[11px] text-muted">{ignoredUsers?.length ?? 0}</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="text-[13px] leading-[20px] text-muted">
          Bài của những người này không hiện ở Dòng tin của bạn nữa. Họ không được báo là đã bị ẩn.
        </Text>
        <View className="mt-3.5 gap-2.5">
          {isLoading ? <ActivityIndicator /> : null}
          {!isLoading && ignoredUsers?.length === 0 ? (
            <Text className="text-sm text-muted py-6 text-center">Chưa ẩn ai.</Text>
          ) : null}
          {ignoredUsers?.map((u) => (
            <View key={u.id} className="flex-row items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3">
              <Avatar initial={u.alias.charAt(0).toUpperCase()} size={38} radius={12} />
              <View className="flex-1">
                <Text className="font-sans-semibold text-sm text-ink">{u.alias}</Text>
              </View>
              <Pressable
                onPress={() => void unignoreUser.mutateAsync(u.id)}
                disabled={unignoreUser.isPending}
                className="px-2.5 py-1.5 rounded-lg border border-border"
              >
                <Text className="text-xs text-muted">Bỏ ẩn</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View className="mt-4 rounded-2xl border border-border bg-white p-3.5">
          <Text className="text-xs leading-[19px] text-muted">
            Ẩn không phải là chặn: bạn vẫn có thể vào hồ sơ họ để xem, và tin khẩn cấp đã được nhiều người xác nhận
            vẫn hiện để bạn không bỏ lỡ cảnh báo an toàn.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
