import { apiClient } from '../client';

interface Envelope<T> {
  data: T;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  const res = await apiClient.get('api/mobile/notifications').json<Envelope<AppNotification[]>>();
  return res.data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`api/mobile/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch('api/mobile/notifications/read-all');
}

export interface NotificationSettings {
  frequency: 'daily' | 'weekly' | 'emergency_only';
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  notifyComments: boolean;
}

export async function fetchNotificationSettings(): Promise<NotificationSettings> {
  const res = await apiClient
    .get('api/mobile/notifications/settings')
    .json<Envelope<NotificationSettings>>();
  return res.data;
}

export async function updateNotificationSettings(
  input: Partial<NotificationSettings>,
): Promise<void> {
  await apiClient.patch('api/mobile/notifications/settings', { json: input });
}
