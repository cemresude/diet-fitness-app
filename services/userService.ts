import { ApiResponse } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '../types/user';

export const userService = {
  // Basit lokal auth: token üretip kullanıcı profilini döndürür.
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const user = buildUserProfile({ email: data.email });
    return {
      success: true,
      data: {
        token: 'demo-token',
        user,
      },
    };
  },

  // Basit lokal kayıt: gelen isim/e-posta ile profil oluşturur.
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const user = buildUserProfile({ email: data.email, name: data.name });
    return {
      success: true,
      data: {
        token: 'demo-token',
        user,
      },
    };
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
