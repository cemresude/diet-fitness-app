// Kullanıcı modeli

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: 'weight_loss' | 'weight_gain' | 'muscle_building' | 'maintenance';
  allergies: string[];
  injuries: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  allergies: string[];
  injuries: string[];
  createdAt: string;
  updatedAt: string;
}

export const toUserProfile = (user: User): UserProfile => ({
  id: user.id,
  email: user.email,
  name: user.name,
  age: user.age,
  weight: user.weight,
  height: user.height,
  goal: user.goal,
  allergies: user.allergies,
  injuries: user.injuries,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
