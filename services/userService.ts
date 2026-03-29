import * as SecureStore from 'expo-secure-store';
import api, { ApiResponse } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '../types/user';
import { ENDPOINTS } from '../utils/constants';

const LOCAL_USER_KEY = 'local_user_profile';

const persistUserProfile = async (user: UserProfile) => {
  await SecureStore.setItemAsync(LOCAL_USER_KEY, JSON.stringify(user));
};

const readUserProfile = async (): Promise<UserProfile | null> => {
  const raw = await SecureStore.getItemAsync(LOCAL_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

export const userService = {
  // Backend auth
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(ENDPOINTS.USER.LOGIN, data);
    const payload = response.data as ApiResponse<AuthResponse>;

    if (payload.success && payload.data?.user) {
      await persistUserProfile(payload.data.user);
    }

    return payload;
  },

  // Backend register
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(ENDPOINTS.USER.REGISTER, data);
    const payload = response.data as ApiResponse<AuthResponse>;

    if (payload.success && payload.data?.user) {
      await persistUserProfile(payload.data.user);
    }

    return payload;
  },

  // Profili backend + local güncelle
  updateProfile: async (updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    const response = await api.put(ENDPOINTS.USER.PROFILE, updates);
    const payload = response.data as ApiResponse<UserProfile>;

    if (payload.success && payload.data) {
      await persistUserProfile(payload.data);
      return payload;
    }

    // fallback: lokal state koru
    const existing = (await readUserProfile()) || buildUserProfile({ email: 'local@user.dev' });
    const merged: UserProfile = {
      ...existing,
      ...updates,
      allergies: updates.allergies ?? existing.allergies ?? [],
      injuries: updates.injuries ?? existing.injuries ?? [],
      updatedAt: new Date().toISOString(),
    };
    await persistUserProfile(merged);
    return { success: true, data: merged };
  },

  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await api.get(ENDPOINTS.USER.PROFILE);
      const payload = response.data as ApiResponse<UserProfile>;
      if (payload.success && payload.data) {
        await persistUserProfile(payload.data);
      }
      return payload;
    } catch {
      const existing = await readUserProfile();
      if (!existing) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Profil bulunamadı',
          },
        };
      }

      return {
        success: true,
        data: existing,
      };
    }
  },

  clearProfile: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(LOCAL_USER_KEY);
  },
};

const buildUserProfile = ({ email, name }: { email: string; name?: string }): UserProfile => {
  const now = new Date().toISOString();
  const safeName = name || email.split('@')[0] || 'Kullanıcı';

  return {
    id: 'local-user',
    email,
    name: safeName,
    allergies: [],
    injuries: [],
    createdAt: now,
    updatedAt: now,
  };
};

export default userService;
