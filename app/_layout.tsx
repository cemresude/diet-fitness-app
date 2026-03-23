import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '../store';
import { COLORS } from '../utils/constants';

export default function RootLayout() {
  const { loadStoredAuth, isLoading } = useUserStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (isLoading) {
    return null; // Splash screen gösterilir
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            title: 'Giriş Yap',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Kayıt Ol',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="disclaimer"
          options={{
            title: 'Feragatname',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
