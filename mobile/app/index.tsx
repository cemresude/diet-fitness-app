import React from 'react';
import { Redirect } from 'expo-router';
import { useUserStore } from '../store';

export default function RootIndex() {
  const { isLoading, hasAcceptedDisclaimer, isAuthenticated } = useUserStore();

  if (isLoading) {
    // Splash ekrani zaten Expo tarafindan gosteriliyor
    return null;
  }

  if (!hasAcceptedDisclaimer) {
    return <Redirect href="/disclaimer" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
