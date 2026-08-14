import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppNotification } from '../../src/api/endpoints/notifications';
import { useMarkNotificationAsRead, useNotifications } from '../../src/hooks/useNotifications';
import { formatFreshness } from '../../src/utils/formatFreshness';

// on.notifications — danh sách thông báo (mục 47): bình luận mới trên bài mình, kết quả xử lý
// report đã gửi (mục 49). Không còn gom "bản tin tuần theo khu vực" như bản mock gốc — đó là 1 hệ
// thống digest riêng (job nền BullMQ, xem notifications.service.ts) chưa nằm trong phạm vi lần này.
export default function NotificationsScreen() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const onPress = (n: AppNotification) => {
    if (!n.isRead) void markAsRead.mutateAsync(n.id);
    if (n.type === 'comment_on_post' && n.referenceId) {
      router.push(`/post/${n.referenceId}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Text className="pl-1.5 font-sans-bold text-[15px] text-ink">Thông báo</Text>
        <View className="flex-1" />
        <Pressable
          onPress={() => router.push('/settings/notifications')}
          className="h-[30px] rounded-lg border border-border bg-white px-2.5 items-center justify-center"
        >
          <Text className="text-xs text-muted">Cài đặt</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4">
        {isLoading ? <ActivityIndicator /> : null}
        {!isLoading && notifications?.length === 0 ? (
          <Text className="text-sm text-muted py-10 text-center">Chưa có thông báo nào.</Text>
        ) : null}

        <View className="rounded-2xl border border-border bg-white overflow-hidden">
          {notifications?.map((n, i) => (
            <Pressable
              key={n.id}
              onPress={() => onPress(n)}
              className={`px-3.5 py-3 flex-row gap-2.5 items-start ${
                i < notifications.length - 1 ? 'border-b border-border-soft' : ''
              } ${n.isRead ? '' : 'bg-primary-50'}`}
            >
              {n.isRead ? null : <View className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />}
              <View className="flex-1">
                <Text className="font-sans-semibold text-[13.5px] text-ink">{n.title}</Text>
                <Text className="text-[11.5px] text-muted mt-0.5">{n.body}</Text>
                <Text className="font-mono-medium text-[10.5px] text-muted-light mt-1">
                  {formatFreshness(n.createdAt)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
