import { create } from 'zustand';
import { UserProfile, UserGoal } from '../types/user';
import * as SecureStore from 'expo-secure-store';
import { userService } from '../services';

interface UserState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasAcceptedDisclaimer: boolean;
  
  // Actions
  setUser: (user: UserProfile) => void;
  setToken: (token: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  acceptDisclaimer: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  hasAcceptedDisclaimer: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  setToken: async (token) => {
    await SecureStore.setItemAsync('auth_token', token);
    set({ token, isAuthenticated: true });
  },

  updateProfile: (updates) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await userService.clearProfile();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  acceptDisclaimer: async () => {
    await SecureStore.setItemAsync('disclaimer_accepted', 'true');
    set({ hasAcceptedDisclaimer: true });
  },

  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const disclaimerAccepted = await SecureStore.getItemAsync('disclaimer_accepted');
      
      set({
        token,
        isAuthenticated: !!token,
        hasAcceptedDisclaimer: disclaimerAccepted === 'true',
        isLoading: false,
      });

      if (token) {
        const profileRes = await userService.getProfile();
        if (profileRes.success && profileRes.data) {
          set({ user: profileRes.data });
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      set({ isLoading: false });
    }
  },
}));
