import { useState } from 'react';
import { INITIAL_NOTIFICATIONS, type NotificationFilter, type NotificationItem } from './data';

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>(() =>
    INITIAL_NOTIFICATIONS.map((item) => ({ ...item })),
  );
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const unread = items.filter((item) => !item.read).length;
  const visible = items.filter((item) => filter === 'all' || item.category === filter);
  const open = (item: NotificationItem) => {
    setItems((previous) => previous.map((row) => (row.id === item.id ? { ...row, read: true } : row)));
    setSelected(item);
  };
  return {
    unread,
    visible,
    filter,
    setFilter,
    selected,
    setSelected,
    open,
    readAll: () => setItems((previous) => previous.map((item) => ({ ...item, read: true }))),
  };
}
