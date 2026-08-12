import { Redirect } from 'expo-router';

// Dashboard quán giờ là tab "Quán" trong (main) — giữ route cũ này chuyển hướng để không vỡ link.
export default function MerchantDashboardRedirect() {
  return <Redirect href="/(main)/merchant" />;
}
