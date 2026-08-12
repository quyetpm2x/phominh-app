import { apiClient } from '../client';

export async function fetchRewardHistory() {
  return apiClient.get('mobile/payments/rewards').json();
}
