import { create } from 'zustand';
import type { CapturedPhoto, CapturePlace } from '../capture/capturePhoto';
import type { CaptureCategory } from '../capture/CaptureControls';

export type PostTopic = 'life' | 'warning' | 'infrastructure' | 'lost';
export type PostDraft = {
  photos: CapturedPhoto[];
  category: CaptureCategory;
  text: string;
  topic: PostTopic;
  anonymous: boolean;
  precise: boolean;
  autoHide: boolean;
  textColor?: string;
  location?: CapturePlace | null;
};
const emptyDraft: PostDraft = {
  photos: [],
  category: 'TIN TỨC XÓM',
  text: '',
  topic: 'life',
  anonymous: true,
  precise: true,
  autoHide: true,
};
export const useNewPostDraft = create<{
  sourceUri: string | null;
  draft: PostDraft;
  completion: PostDraft | null;
  completePreview: () => boolean;
  start: (photo: CapturedPhoto, category: CaptureCategory) => void;
  startStatus: () => void;
  update: (patch: Partial<PostDraft>) => void;
}>((set, get) => ({
  completion: null,
  completePreview: () => {
    const draft = get().draft;
    if (!draft.text.trim() && !draft.photos.length) return false;
    set({
      completion: {
        ...draft,
        photos: draft.photos.map((photo) => ({ ...photo, place: photo.place ? { ...photo.place } : null })),
      },
    });
    return true;
  },
  sourceUri: null,
  startStatus: () => set({ sourceUri: null, draft: { ...emptyDraft, anonymous: false, autoHide: false } }),
  draft: emptyDraft,
  start: (photo, category) =>
    set((state) =>
      state.sourceUri === photo.uri
        ? { draft: { ...state.draft, category } }
        : { sourceUri: photo.uri, draft: { ...emptyDraft, photos: [photo], category } },
    ),
  update: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
}));

export const topics = [
  {
    id: 'life',
    title: 'Đời sống',
    description: 'Ăn uống, sinh hoạt',
    icon: 'newPostLife',
    color: '#FF416C',
    background: '#FF416C1A',
  },
  {
    id: 'warning',
    title: 'Cảnh báo',
    description: 'An ninh, trộm cắp',
    icon: 'newPostWarning',
    color: '#E17100',
    background: '#FE9A0026',
  },
  {
    id: 'infrastructure',
    title: 'Sự cố hạ tầng',
    description: 'Mất điện, cúp nước',
    icon: 'newPostInfrastructure',
    color: '#2B7FFF',
    background: '#2B7FFF26',
  },
  {
    id: 'lost',
    title: 'Tìm đồ lạc',
    description: 'Thú cưng, ví, giấy tờ',
    icon: 'newPostLost',
    color: '#00BC7D',
    background: '#00BC7D26',
  },
] as const;
