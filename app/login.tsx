import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store';
import { Input, Button } from '../components/ui';
import { userService } from '../services';
import { COLORS } from '../utils/constants';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setToken, isAuthenticated } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const validate = () => {
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nextErrors.email = 'E-posta zorunludur';
    }

    if (!password) {
      nextErrors.password = 'Şifre zorunludur';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const normalizedEmail = email.trim().toLowerCase();
      const response = await userService.login({ email: normalizedEmail, password });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Giriş başarısız');
      }

      const { token, user } = response.data;

      // Token'ı ve kullanıcı bilgisini store'a kaydet
      setToken(token);
      setUser(user);

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Giriş Hatası', error?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Diet & Fitness AI</Text>
        <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

        <Input
          label="E-posta"
          placeholder="ornek@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          error={errors.email}
        />

        <Input
          label="Şifre"
          placeholder="Şifreniz"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          error={errors.password}
        />

        <Button
          title="Giriş Yap"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          size="large"
          style={styles.button}
        />

        <Text style={styles.registerHint}>
          Hesabın yok mu?{' '}
          <Text
            style={styles.registerLink}
            onPress={() => router.push('/register' as any)}
          >
            Kayıt Ol
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  registerHint: {
    marginTop: 8,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
