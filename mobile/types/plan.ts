// Plan ile ilgili tipler

import { UserGoal } from './user';

export interface Plan {
  id: string;
  userId: string;
  dietPlan: DietPlan;
  workoutPlan: WorkoutPlan;
  createdAt: string;
  validUntil: string;
}

// Diyet Planı
export interface DietPlan {
  dailyCalories: number;
  macros: Macros;
  weeklyMenu: DailyMenu[];
  recommendations: string[];
  restrictions: string[];
}

export interface Macros {
  protein: number; // gram
  carbs: number; // gram
  fat: number; // gram
  fiber?: number; // gram
}

export interface DailyMenu {
  day: WeekDay;
  meals: Meal[];
  totalCalories: number;
}

export interface Meal {
  type: MealType;
  name: string;
  calories: number;
  macros: Macros;
  ingredients: string[];
  recipe?: string;
  prepTime?: number; // dakika
}

export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Kahvaltı',
  morning_snack: 'Kuşluk',
  lunch: 'Öğle Yemeği',
  afternoon_snack: 'İkindi',
  dinner: 'Akşam Yemeği',
};

// Antrenman Planı
export interface WorkoutPlan {
  weeklySchedule: DailyWorkout[];
  restDays: WeekDay[];
  recommendations: string[];
  warmUpRoutine: Exercise[];
  coolDownRoutine: Exercise[];
}

export interface DailyWorkout {
  day: WeekDay;
  focus: WorkoutFocus;
  duration: number; // dakika
  intensity: 'low' | 'medium' | 'high';
  exercises: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string; // "12" veya "12-15"
  duration?: number; // saniye (plank gibi hareketler için)
  rest: number; // saniye
  equipment?: string[];
  notes?: string;
  alternatives?: string[]; // Sakatlık durumunda alternatifler
}

export type WorkoutFocus = 
  | 'upper_body'
  | 'lower_body'
  | 'full_body'
  | 'core'
  | 'cardio'
  | 'flexibility'
  | 'rest';

export const WORKOUT_FOCUS_LABELS: Record<WorkoutFocus, string> = {
  upper_body: 'Üst Vücut',
  lower_body: 'Alt Vücut',
  full_body: 'Tüm Vücut',
  core: 'Core / Karın',
  cardio: 'Kardiyo',
  flexibility: 'Esneklik',
  rest: 'Dinlenme',
};

export type WeekDay = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const WEEKDAY_LABELS: Record<WeekDay, string> = {
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar',
};

// Plan oluşturma isteği
export interface GeneratePlanRequest {
  userProfile: {
    age: number;
    weight: number;
    height: number;
    goal: UserGoal;
    allergies: string[];
    injuries: string[];
  };
}
