import { apiClient } from '../client';

export interface CreateReportInput {
  targetType: 'post' | 'comment' | 'merchant_suspicious';
  targetId: string;
  reason: string;
  description?: string;
}

// Báo cáo bài/bình luận vi phạm (mục 30, 31) — ẩn danh với người bị báo cáo (bussiness).
export async function createReport(input: CreateReportInput): Promise<void> {
  await apiClient.post('api/mobile/reports', { json: input });
}
