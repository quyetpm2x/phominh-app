import { create } from 'zustand';
export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  outgoing: boolean;
  image?: string;
  localOnly?: boolean;
}
export const HOA_MESSAGES: ChatMessage[] = [
  {
    id: 'hoa-1',
    text: 'Chào cháu Quyết, hôm nay cháu có ăn bún chả không cô để phần cho nhé? Nem cua bể vừa mới rán giòn nóng hổi luôn!',
    time: '11:15',
    outgoing: false,
  },
  {
    id: 'hoa-2',
    text: 'Dạ có ạ cô Hoa! Cô để riêng cho cháu 2 suất đầy đủ nem nhé, khoảng 11h40 cháu qua lấy liền.',
    time: '11:17',
    outgoing: true,
  },
  {
    id: 'hoa-3',
    text: 'Nhất trí nhé cháu ơi! Cô đóng gói cẩn thận để trên bàn chờ cháu qua.',
    time: '11:18',
    outgoing: false,
  },
];
interface ChatState {
  readIds: string[];
  localMessages: Record<string, ChatMessage[]>;
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  addLocalMessage: (id: string, text: string, image?: string) => boolean;
}
export const useChatStore = create<ChatState>((set) => ({
  readIds: [],
  localMessages: {},
  markRead: (id) => set((state) => ({ readIds: [...new Set([...state.readIds, id])] })),
  markAllRead: (ids) => set((state) => ({ readIds: [...new Set([...state.readIds, ...ids])] })),
  addLocalMessage: (id, text, image) => {
    if (!text.trim() && !image) return false;
    const now = new Date();
    const message: ChatMessage = {
      id: `local-${now.getTime()}-${Math.random().toString(36).slice(2)}`,
      text: text.trim(),
      image,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      outgoing: true,
      localOnly: true,
    };
    set((state) => ({
      localMessages: { ...state.localMessages, [id]: [...(state.localMessages[id] ?? []), message] },
    }));
    return true;
  },
}));
