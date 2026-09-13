import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { NotificationGroup } from './NotificationGroup';
import { NotificationsHeader } from './NotificationsHeader';
import { NotificationSheets } from './NotificationSheets';
import type { useNotifications } from './useNotifications';

export function NotificationsTab({ controller }: { controller: ReturnType<typeof useNotifications> }) {
  const { unread, visible, filter, setFilter, selected, setSelected, open, readAll } = controller;
  return (
    <>
      <NotificationsHeader
        unread={unread}
        filter={filter}
        onFilter={setFilter}
        onReadAll={readAll}
        onSettings={() => router.push('/notification-settings')}
      />
      <ScrollView className="flex-1 bg-[#F8F9FA]" contentContainerStyle={styles.content}>
        <NotificationGroup items={visible.filter((item) => !item.read)} unread onOpen={open} />
        <NotificationGroup items={visible.filter((item) => item.read)} onOpen={open} />
        {visible.length === 0 ? (
          <Text className="py-10 text-center font-sans text-sm text-muted">
            Không có thông báo trong mục này.
          </Text>
        ) : null}
        <View className="flex-row items-center justify-center gap-2 py-3">
          <CustomIcon name="successCheck" size={13} color="#00A982" />
          <Text className="font-sans text-[11px] text-[#4A4A4A]">
            Bạn đã xem hết thông báo trong 30 ngày qua
          </Text>
        </View>
      </ScrollView>
      <NotificationSheets
        selected={selected}
        onClose={() => {
          setSelected(null);
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 24, paddingBottom: 60, flexGrow: 1 } });
