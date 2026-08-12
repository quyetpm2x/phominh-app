import { create } from 'zustand';

// Trạng thái UI thuần túy, không liên quan server — nhẹ hơn Redux (mục 2 tài liệu FE).
interface UIState {
  isPostComposerOpen: boolean;
  openPostComposer: () => void;
  closePostComposer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPostComposerOpen: false,
  openPostComposer: () => set({ isPostComposerOpen: true }),
  closePostComposer: () => set({ isPostComposerOpen: false }),
}));
