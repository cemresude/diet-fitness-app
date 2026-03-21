import api, { ApiResponse } from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/user';
import { ENDPOINTS } from '../utils/constants';

export const userService = {
  // Kullanıcı girişi
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(ENDPOINTS.USER.LOGIN, data);
    return response.data;
  },

  // Kullanıcı kaydı
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post(ENDPOINTS.USER.REGISTER, data);
    return response.data;
  },
};

export default userService;
