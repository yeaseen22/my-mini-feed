import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Entry() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(auth)/login" />;
}
