import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Entry() {
  const { isAuthenticated } = useAuthStore();
  const [checked, setChecked] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@has_seen_welcome').then((val) => {
      setHasSeenWelcome(val === 'true');
      setChecked(true);
    });
  }, []);

  if (!checked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  if (!hasSeenWelcome) {
    return <Redirect href="/(auth)/welcome" />;
  }
  return <Redirect href="/(auth)/login" />;
}
