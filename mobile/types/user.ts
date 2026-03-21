// Kullanıcı ile ilgili tipler

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  goal?: UserGoal;
  allergies: string[];
  injuries: string[];
  createdAt: string;
  updatedAt: string;
}

export type UserGoal = 'weight_loss' | 'weight_gain' | 'muscle_building' | 'maintenance';

export interface UserGoalInfo {
  type: UserGoal;
  label: string;
  description: string;
  icon: string;
}

export const USER_GOALS: UserGoalInfo[] = [
  {
    type: 'weight_loss',
    label: 'Kilo Verme',
    description: 'Yağ yakarak sağlıklı kilo kaybı',
    icon: '⬇️',
  },
  {
    type: 'weight_gain',
    label: 'Kilo Alma',
    description: 'Sağlıklı şekilde kilo kazanımı',
    icon: '⬆️',
  },
  {
    type: 'muscle_building',
    label: 'Kas Yapma',
    description: 'Kas kütlesi artırma ve şekillenme',
    icon: '💪',
  },
  {
    type: 'maintenance',
    label: 'Koruma',
    description: 'Mevcut kiloyu ve formu koruma',
    icon: '⚖️',
  },
];

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
