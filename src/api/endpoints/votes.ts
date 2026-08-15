import { apiClient } from '../client';

export interface CastVoteInput {
  targetType: 'post' | 'comment';
  targetId: string;
}

// Vote "hữu ích" (mục 28) — 1 CHIỀU, không có un-vote (khớp backend VotesService.castVote).
// Backend tự chặn: tự vote bài mình (400), tài khoản <24h (403), đã vote rồi (400).
export async function castVote(input: CastVoteInput): Promise<void> {
  await apiClient.post('api/mobile/votes', { json: input });
}
