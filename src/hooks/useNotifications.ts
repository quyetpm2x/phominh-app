import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchNotifications,
  fetchNotificationSettings,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  updateNotificationSettings,
  type NotificationSettings,
} from '../api/endpoints/notifications';

export function useNotifications() {
  return useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useNotificationSettings() {
  return useQuery({ queryKey: ['notificationSettings'], queryFn: fetchNotificationSettings });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<NotificationSettings>) => updateNotificationSettings(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['notificationSettings'] }),
  });
}
