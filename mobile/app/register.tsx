import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store';
import { Input, Button } from '../components/ui';
import { userService } from '../services';
import { COLORS } from '../utils/constants';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser, setToken, isAuthenticated } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!name.trim()) {
      nextErrors.name = 'İsim zorunludur';
    }
    if (!email.trim()) {
      nextErrors.email = 'E-posta zorunludur';
    }
    if (!password) {
      nextErrors.password = 'Şifre zorunludur';
    } else if (password.length < 6) {
      nextErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    if (!passwordConfirm) {
      nextErrors.passwordConfirm = 'Şifre tekrar zorunludur';
    } else if (passwordConfirm !== password) {
      nextErrors.passwordConfirm = 'Şifreler eşleşmiyor';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await userService.register({ email, password, name });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Kayıt başarısız');
      }

      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Register error:', error);
      Alert.alert('Kayıt Hatası', error?.message || 'Kayıt olurken bir hata oluştu.');
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
        <Text style={styles.subtitle}>Yeni bir hesap oluşturun</Text>

        <Input
          label="İsim"
          placeholder="Adınız"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          error={errors.name}
        />

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

        <Input
          label="Şifre (Tekrar)"
          placeholder="Şifrenizi tekrar girin"
          secureTextEntry
          value={passwordConfirm}
          onChangeText={(text) => {
            setPasswordConfirm(text);
            if (errors.passwordConfirm) {
              setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
            }
          }}
          error={errors.passwordConfirm}
        />

        <Button
          title="Kayıt Ol"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          size="large"
          style={styles.button}
        />

        <TouchableOpacity
          style={styles.switchLink}
          onPress={() => router.push('/login' as any)}
        >
          <Text style={styles.switchText}>Zaten hesabın var mı? </Text>
          <Text style={[styles.switchText, styles.switchTextBold]}>Giriş Yap</Text>
        </TouchableOpacity>
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
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  switchLink: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  switchTextBold: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});
