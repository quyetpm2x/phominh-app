import { create } from 'zustand';

import type { PostTypeFilter, SortMode } from '../lib/postListFilters';

// Bộ lọc dòng tin (Tầng 2 task 13) — sống độc lập, áp dụng chung cho cả 3 tab Nhà/Chỗ làm/Quanh đây
// trong phiên hiện tại (quyết định đã chốt, xem spec 2026-08-12), không reset khi đổi tab.
interface FilterState {
  postTypes: PostTypeFilter[];
  sortMode: SortMode;
  radiusOverrideKm: number | null;
  setPostTypes: (postTypes: PostTypeFilter[]) => void;
  setSortMode: (sortMode: SortMode) => void;
  setRadiusOverrideKm: (radiusOverrideKm: number | null) => void;
  reset: () => void;
}

const initialState = {
  postTypes: [] as PostTypeFilter[],
  sortMode: 'default' as SortMode,
  radiusOverrideKm: null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setPostTypes: (postTypes) => set({ postTypes }),
  setSortMode: (sortMode) => set({ sortMode }),
  setRadiusOverrideKm: (radiusOverrideKm) => set({ radiusOverrideKm }),
  reset: () => set(initialState),
}));
