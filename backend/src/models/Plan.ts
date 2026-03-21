// Plan modeli

export type WeekDay = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';

export type WorkoutFocus = 
  | 'upper_body'
  | 'lower_body'
  | 'full_body'
  | 'core'
  | 'cardio'
  | 'flexibility'
  | 'rest';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Meal {
  type: MealType;
  name: string;
  calories: number;
  macros: Macros;
  ingredients: string[];
  recipe?: string;
  prepTime?: number;
}

export interface DailyMenu {
  day: WeekDay;
  meals: Meal[];
  totalCalories: number;
}

export interface DietPlan {
  dailyCalories: number;
  macros: Macros;
  weeklyMenu: DailyMenu[];
  recommendations: string[];
  restrictions: string[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  duration?: number;
  rest: number;
  equipment?: string[];
  notes?: string;
  alternatives?: string[];
}

export interface DailyWorkout {
  day: WeekDay;
  focus: WorkoutFocus;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  exercises: Exercise[];
  notes?: string;
}

export interface WorkoutPlan {
  weeklySchedule: DailyWorkout[];
  restDays: WeekDay[];
  recommendations: string[];
  warmUpRoutine: Exercise[];
  coolDownRoutine: Exercise[];
}

export interface Plan {
  id: string;
  userId: string;
  dietPlan: DietPlan;
  workoutPlan: WorkoutPlan;
  userProfile: {
    age: number;
    weight: number;
    height: number;
    goal: string;
    allergies: string[];
    injuries: string[];
  };
  createdAt: Date;
  validUntil: Date;
}

export interface PlanResponse {
  id: string;
  userId: string;
  dietPlan: DietPlan;
  workoutPlan: WorkoutPlan;
  createdAt: string;
  validUntil: string;
}

export const toPlanResponse = (plan: Plan): PlanResponse => ({
  id: plan.id,
  userId: plan.userId,
  dietPlan: plan.dietPlan,
  workoutPlan: plan.workoutPlan,
  createdAt: plan.createdAt.toISOString(),
  validUntil: plan.validUntil.toISOString(),
});
