import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5001';

const LoginScreen = ({ navigation }: { navigation?: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'E-posta gerekli';
    if (!password) nextErrors.password = 'Şifre gerekli';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user_id', data.user?.id ?? '');
      Alert.alert('Başarılı', 'Giriş yapıldı.');
      navigation?.replace?.('Home');
    } catch (err: any) {
      Alert.alert('Hata', err?.response?.data?.message ?? 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diet & Fitness</Text>
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="E-posta"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          errors.email && setErrors((prev) => ({ ...prev, email: undefined }));
        }}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          errors.password && setErrors((prev) => ({ ...prev, password: undefined }));
        }}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation?.navigate?.('Register')}>
        <Text style={styles.link}>Hesabın yok mu? Kayıt ol</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f7f7f7' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 32, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e1e1e1' },
  inputError: { borderColor: '#ff6b6b' },
  button: { backgroundColor: '#2e86de', paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 16, textAlign: 'center', color: '#2e86de', fontWeight: '500' },
  errorText: { color: '#ff6b6b', marginBottom: 8 },
});

export default LoginScreen;
