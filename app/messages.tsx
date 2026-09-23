import { Redirect } from 'expo-router';
export default function MessagesScreen() {
  return <Redirect href="/home?tab=messages" />;
}
