import { useState } from 'react';
import {
  INITIAL_NOTIFICATIONS,
  type NotificationCategory,
  type NotificationFilter,
  type NotificationItem,
} from './data';

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>(() =>
    INITIAL_NOTIFICATIONS.map((item) => ({ ...item })),
  );
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const [preferences, setPreferences] = useState<Record<NotificationCategory, boolean>>({
    interaction: true,
    rewards: true,
    shops: true,
    system: true,
  });
  const enabled = items.filter((item) => preferences[item.category]);
  const unread = enabled.filter((item) => !item.read).length;
  const visible = enabled.filter((item) => filter === 'all' || item.category === filter);
  const open = (item: NotificationItem) => {
    setItems((previous) => previous.map((row) => (row.id === item.id ? { ...row, read: true } : row)));
    setSelected(item);
  };
  return {
    unread,
    visible,
    filter,
    setFilter,
    settingsOpen,
    setSettingsOpen,
    selected,
    setSelected,
    preferences,
    setPreferences,
    open,
    readAll: () => setItems((previous) => previous.map((item) => ({ ...item, read: true }))),
  };
}
