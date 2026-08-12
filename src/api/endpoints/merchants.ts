import { apiClient } from '../client';

export async function fetchMerchantDashboard() {
  return apiClient.get('mobile/merchants/me').json();
}
