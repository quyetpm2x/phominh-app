import { Redirect } from 'expo-router';

export default function NotificationsScreen() {
  return <Redirect href={{ pathname: '/home', params: { tab: 'notifications' } }} />;
}
