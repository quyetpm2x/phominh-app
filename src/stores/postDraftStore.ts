import { create } from 'zustand';

// State bài đăng đang soạn, sống suốt vòng đời flow camera → review → caption → confirm (route
// riêng theo file nên không truyền được state qua props bình thường) — dùng zustand thay vì router
// params vì có nhiều trường, và ảnh (URI) không nên nhồi vào query string.
interface PostDraftState {
  photoUri: string | null;
  lat: number | null;
  lng: number | null;
  capturedAt: number | null; // epoch ms, lúc chụp — hiển thị "chụp lúc HH:mm"
  content: string;
  category: string; // nhãn UI (composeTypeChips) — CHƯA có field tương ứng ở backend, chỉ hiển thị
  displayMode: 'alias' | 'real_name';
  setPhoto: (uri: string, lat: number, lng: number) => void;
  clearPhoto: () => void;
  setContent: (content: string) => void;
  setCategory: (category: string) => void;
  setDisplayMode: (mode: 'alias' | 'real_name') => void;
  reset: () => void;
}

const initialState = {
  photoUri: null,
  lat: null,
  lng: null,
  capturedAt: null,
  content: '',
  category: '',
  displayMode: 'alias' as const,
};

export const usePostDraftStore = create<PostDraftState>((set) => ({
  ...initialState,
  setPhoto: (uri, lat, lng) => set({ photoUri: uri, lat, lng, capturedAt: Date.now() }),
  clearPhoto: () => set({ photoUri: null, lat: null, lng: null, capturedAt: null }),
  setContent: (content) => set({ content }),
  setCategory: (category) => set({ category }),
  setDisplayMode: (displayMode) => set({ displayMode }),
  reset: () => set(initialState),
}));
