import { create } from 'zustand';

import type { PostFontSize } from '../constants/post-style-presets';

// State bài đăng đang soạn, sống suốt vòng đời flow camera → review → caption → confirm (route
// riêng theo file nên không truyền được state qua props bình thường) — dùng zustand thay vì router
// params vì có nhiều trường, và ảnh (URI) không nên nhồi vào query string.
interface PostDraftState {
  photoUri: string | null;
  lat: number | null;
  lng: number | null;
  isMockLocation: boolean; // chống giả mạo GPS (mục 7a) — expo-location LocationObject.mocked, chỉ đáng tin trên Android
  // Ảnh chọn từ thư viện thay vì chụp trực tiếp — CHỈ hợp lệ cho merchant đã xác minh (mục 19),
  // backend tự chặn lại lần nữa (MerchantsService.assertVerifiedForLibraryPhoto) nếu không phải.
  isLibraryPhoto: boolean;
  capturedAt: number | null; // epoch ms, lúc chụp — hiển thị "chụp lúc HH:mm"
  content: string;
  // Nhãn UI (composeTypeChips) — map sang postType thật qua mapCategoryToPostType() ở confirm.tsx
  // (mục 19 phát hiện: trước đây KHÔNG map, nên không ai tạo được bài 'emergency' qua luồng chính).
  category: string;
  displayMode: 'alias' | 'real_name';
  // Style toàn bộ nội dung (mục 22) — null = mặc định, không gửi field style lên server.
  textColor: string | null;
  backgroundColor: string | null;
  fontSize: PostFontSize | null;
  setPhoto: (
    uri: string,
    lat: number,
    lng: number,
    isMockLocation: boolean,
    isLibraryPhoto?: boolean,
  ) => void;
  clearPhoto: () => void;
  setContent: (content: string) => void;
  setCategory: (category: string) => void;
  setDisplayMode: (mode: 'alias' | 'real_name') => void;
  setTextColor: (color: string | null) => void;
  setBackgroundColor: (color: string | null) => void;
  setFontSize: (size: PostFontSize | null) => void;
  reset: () => void;
}

const initialState = {
  photoUri: null,
  lat: null,
  lng: null,
  isMockLocation: false,
  isLibraryPhoto: false,
  capturedAt: null,
  content: '',
  category: '',
  displayMode: 'alias' as const,
  textColor: null,
  backgroundColor: null,
  fontSize: null,
};

export const usePostDraftStore = create<PostDraftState>((set) => ({
  ...initialState,
  setPhoto: (uri, lat, lng, isMockLocation, isLibraryPhoto = false) =>
    set({ photoUri: uri, lat, lng, isMockLocation, isLibraryPhoto, capturedAt: Date.now() }),
  clearPhoto: () =>
    set({ photoUri: null, lat: null, lng: null, isMockLocation: false, isLibraryPhoto: false, capturedAt: null }),
  setContent: (content) => set({ content }),
  setCategory: (category) => set({ category }),
  setDisplayMode: (displayMode) => set({ displayMode }),
  setTextColor: (textColor) => set({ textColor }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setFontSize: (fontSize) => set({ fontSize }),
  reset: () => set(initialState),
}));
