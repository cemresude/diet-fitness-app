import { v4 as uuidv4 } from 'uuid';
import { collections } from '../config/firebase';
import { Plan, DietPlan, WorkoutPlan } from '../models/Plan';
import { aiService } from './aiService';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
  allergies: string[];
  injuries: string[];
}

// Ortak fallback plan oluşturucu (AI başarısız olduğunda kullanılır)
const buildFallbackPlan = (userProfile: UserProfile): { dietPlan: DietPlan; workoutPlan: WorkoutPlan } => {
  // BMR hesapla (Mifflin-St Jeor)
  const bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
  let dailyCalories = Math.round(bmr * 1.55); // Orta aktivite seviyesi

  // Hedefe göre kalori ayarla
  switch (userProfile.goal) {
    case 'weight_loss':
      dailyCalories = Math.round(dailyCalories * 0.8);
      break;
    case 'weight_gain':
      dailyCalories = Math.round(dailyCalories * 1.15);
      break;
    case 'muscle_building':
      dailyCalories = Math.round(dailyCalories * 1.1);
      break;
  }

  const dietPlan: DietPlan = {
    dailyCalories,
    macros: {
      protein: Math.round(userProfile.weight * 2),
      carbs: Math.round((dailyCalories * 0.45) / 4),
      fat: Math.round((dailyCalories * 0.25) / 9),
    },
    weeklyMenu: [],
    recommendations: [
      'Günde en az 2-3 litre su için',
      'Öğünleri düzenli saatlerde yiyin',
      'Taze sebze ve meyve tüketimini artırın',
    ],
    restrictions: userProfile.allergies.length > 0
      ? [`Şu besinlerden kaçının: ${userProfile.allergies.join(', ')}`]
      : [],
  };

  const workoutPlan: WorkoutPlan = {
    weeklySchedule: [],
    restDays: ['saturday', 'sunday'],
    recommendations: [
      'Antrenmandan önce 5-10 dakika ısınma yapın',
      'Antrenmandan sonra esneme hareketleri yapın',
      'Yeterli uyku almaya özen gösterin',
    ],
    warmUpRoutine: [
      { name: 'Hafif koşu', duration: 300, rest: 0 },
      { name: 'Dinamik germe', duration: 300, rest: 0 },
    ],
    coolDownRoutine: [
      { name: 'Yürüyüş', duration: 300, rest: 0 },
      { name: 'Statik germe', duration: 300, rest: 0 },
    ],
  };

  return { dietPlan, workoutPlan };
};

export const planGenerator = {
  // Plan oluştur
  generatePlan: async (userId: string, userProfile: UserProfile): Promise<Plan> => {
    if (!userId) {
      throw new Error('User must be authenticated to generate a plan.');
    }

    try {
      // AI ile plan oluşturmayı dene
      const generatedPlan = await aiService.generatePlan(userProfile);

      if (!generatedPlan?.dietPlan || !generatedPlan?.workoutPlan) {
        throw new Error('Generated plan schema invalid (dietPlan/workoutPlan missing)');
      }

      const plan: Plan = {
        id: uuidv4(),
        userId,
        dietPlan: generatedPlan.dietPlan,
        workoutPlan: generatedPlan.workoutPlan,
        userProfile,
        createdAt: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 hafta geçerli
      };

      await collections.plans.doc(plan.id).set(plan);
      return plan;
    } catch (error) {
      console.error('Plan generation failed before database save:', {
        userId,
        userProfile,
        error,
      });

      // Fallback otomatik kullanılmasın: hatayı controller'a ilet
      throw error;
    }
  },

  // Plan getir
  getPlan: async (planId: string): Promise<Plan | null> => {
    const doc = await collections.plans.doc(planId).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
      ...data,
      createdAt: data?.createdAt?.toDate(),
      validUntil: data?.validUntil?.toDate(),
    } as Plan;
  },

  // Kullanıcının planlarını getir
  getUserPlans: async (userId: string, limit: number = 10): Promise<Plan[]> => {
    const snapshot = await collections.plans
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data?.createdAt?.toDate(),
        validUntil: data?.validUntil?.toDate(),
      } as Plan;
    });
  },

  // Fallback plan (isteyen yerden direkt kullanmak için exposed bırakıyoruz)
  generateFallbackPlan: (userProfile: UserProfile): { dietPlan: DietPlan; workoutPlan: WorkoutPlan } => {
    return buildFallbackPlan(userProfile);
  },
};

export default planGenerator;
