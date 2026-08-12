import type { QueryClient } from '@tanstack/react-query';

import { createPost, extractErrorMessage, uploadPostImage } from '../api/client';
import { usePendingPostStore, type PendingPost } from '../stores/pendingPostStore';

// Chạy nền, độc lập vòng đời màn hình — gọi 1 lần lúc "Đăng lên xóm" (confirm.tsx, không await
// trước khi điều hướng) và gọi lại y hệt lúc bấm "Thử lại" trên thẻ pending (PendingPostCard).
export async function submitPendingPost(queryClient: QueryClient, pending: PendingPost): Promise<void> {
  const { markUploading, markError, removePending } = usePendingPostStore.getState();
  markUploading(pending.localId);
  try {
    const imageUrls = [await uploadPostImage(pending.photoUri)];
    await createPost({
      postType: 'life',
      content: pending.content,
      lat: pending.lat,
      lng: pending.lng,
      displayMode: pending.displayMode,
      imageUrls,
    });
    // Làm mới danh sách feed đang cache — bài mới tự lên đầu qua đúng thuật toán xếp hạng, không
    // cần chèn tay (xem giải thích chi tiết cũ ở confirm.tsx trước khi tách hàm này ra).
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    removePending(pending.localId);
  } catch (err) {
    markError(pending.localId, await extractErrorMessage(err));
  }
}
