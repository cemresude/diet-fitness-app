// Basit fallback plan üreticisi. Gerçek üretim için Gemini/OpenAI ve veri kalıcılığını ekleyin.
import { GeneratePlanRequest, Plan, WeekDay } from '../../types/plan';

const WEEK_DAYS: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const generateId = () => Math.random().toString(36).slice(2, 10);

const calculateDailyCalories = (age: number, weight: number, height: number, goal: string) => {
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Mifflin-St Jeor
  let calories = Math.round(bmr * 1.55);

  switch (goal) {
    case 'weight_loss':
      calories = Math.round(calories * 0.8);
      break;
    case 'weight_gain':
      calories = Math.round(calories * 1.15);
      break;
    case 'muscle_building':
      calories = Math.round(calories * 1.1);
      break;
    default:
      break;
  }

  return calories;
};

const buildPlan = (payload: GeneratePlanRequest): Plan => {
  const { age, weight, height, goal, allergies, injuries } = payload.userProfile;

  const dailyCalories = calculateDailyCalories(age, weight, height, goal);

  const macros = {
    protein: Math.round(weight * 2),
    carbs: Math.round((dailyCalories * 0.45) / 4),
    fat: Math.round((dailyCalories * 0.25) / 9),
  };

  const defaultMeals = [
    {
      type: 'breakfast' as const,
      name: 'Yulaf, yoğurt ve meyve kasesi',
      ingredients: ['Yulaf', 'Yoğurt', 'Muz', 'Çilek', 'Badem'],
      ratio: 0.3,
    },
    {
      type: 'lunch' as const,
      name: 'Izgara tavuk, esmer pirinç ve sebze',
      ingredients: ['Tavuk göğüs', 'Esmer pirinç', 'Brokoli', 'Zeytinyağı'],
      ratio: 0.35,
    },
    {
      type: 'dinner' as const,
      name: 'Somon, kinoa ve avokado salatası',
      ingredients: ['Somon', 'Kinoa', 'Avokado', 'Roka', 'Limon'],
      ratio: 0.35,
    },
  ];

  const weeklyMenu = WEEK_DAYS.map((day) => {
    const meals = defaultMeals.map((meal) => {
      const calories = Math.round(dailyCalories * meal.ratio);
      return {
        type: meal.type,
        name: meal.name,
        calories,
        macros: {
          protein: Math.round(macros.protein * meal.ratio),
          carbs: Math.round(macros.carbs * meal.ratio),
          fat: Math.round(macros.fat * meal.ratio),
        },
        ingredients: meal.ingredients,
      };
    });

    return {
      day,
      meals,
      totalCalories: dailyCalories,
    };
  });

  const weeklySchedule = [
    {
      day: 'monday' as const,
      focus: 'upper_body' as const,
      duration: 45,
      intensity: 'medium' as const,
      exercises: [
        { name: 'Bench press', sets: 3, reps: 10, rest: 90 },
        { name: 'Dumbbell row', sets: 3, reps: 12, rest: 90 },
        { name: 'Shoulder press', sets: 3, reps: 12, rest: 90 },
      ],
    },
    {
      day: 'tuesday' as const,
      focus: 'lower_body' as const,
      duration: 45,
      intensity: 'medium' as const,
      exercises: [
        { name: 'Squat', sets: 3, reps: 12, rest: 90 },
        { name: 'Romanian deadlift', sets: 3, reps: 12, rest: 90 },
        { name: 'Walking lunge', sets: 3, reps: 12, rest: 90 },
      ],
    },
    {
      day: 'wednesday' as const,
      focus: 'cardio' as const,
      duration: 30,
      intensity: 'low' as const,
      exercises: [{ name: 'Hızlı tempo yürüyüş', duration: 1800, rest: 0 }],
    },
    {
      day: 'thursday' as const,
      focus: 'full_body' as const,
      duration: 40,
      intensity: 'medium' as const,
      exercises: [
        { name: 'Kettlebell swing', sets: 3, reps: 15, rest: 60 },
        { name: 'Push-up', sets: 3, reps: 12, rest: 60 },
        { name: 'Plank', duration: 60, rest: 60 },
      ],
    },
    {
      day: 'friday' as const,
      focus: 'core' as const,
      duration: 30,
      intensity: 'medium' as const,
      exercises: [
        { name: 'Russian twist', sets: 3, reps: 20, rest: 45 },
        { name: 'Leg raise', sets: 3, reps: 15, rest: 45 },
        { name: 'Side plank', duration: 45, rest: 45 },
      ],
    },
    {
      day: 'saturday' as const,
      focus: 'flexibility' as const,
      duration: 25,
      intensity: 'low' as const,
      exercises: [
        { name: 'Yoga akışı', duration: 900, rest: 0 },
        { name: 'Derin nefes çalışması', duration: 300, rest: 0 },
      ],
    },
    {
      day: 'sunday' as const,
      focus: 'rest' as const,
      duration: 0,
      intensity: 'low' as const,
      exercises: [],
    },
  ];

  const restrictions = allergies.length
    ? [`Alerji: ${allergies.join(', ')}`]
    : [];

  if (injuries.length) {
    restrictions.push(`Dikkat edilmesi gereken sakatlıklar: ${injuries.join(', ')}`);
  }

  const now = new Date();
  const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    id: generateId(),
    userId: 'local-user',
    dietPlan: {
      dailyCalories,
      macros,
      weeklyMenu,
      recommendations: [
        'Günde 2-3 litre su tüketin.',
        'Her öğünde protein, karbonhidrat ve sağlıklı yağ dengesini koruyun.',
        'Uyku düzeninize dikkat edin (7-8 saat).',
      ],
      restrictions,
    },
    workoutPlan: {
      weeklySchedule,
      restDays: ['sunday', 'wednesday'],
      recommendations: [
        'Antrenman öncesi 5-10 dakika ısınma yapın.',
        'Hareketleri kontrollü ve doğru formda uygulayın.',
        'İlerledikçe ağırlığı kademeli artırın.',
      ],
      warmUpRoutine: [
        { name: 'Hafif koşu', duration: 300, rest: 0 },
        { name: 'Dinamik germe', duration: 240, rest: 0 },
      ],
      coolDownRoutine: [
        { name: 'Yavaş yürüyüş', duration: 240, rest: 0 },
        { name: 'Statik germe', duration: 240, rest: 0 },
      ],
    },
    createdAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
  };
};

export async function POST(request: Request): Promise<Response> {
  const body = await request.json().catch(() => null);

  if (!body?.userProfile) {
    return Response.json(
      {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'userProfile alanı gerekli.',
        },
      },
      { status: 400 }
    );
  }

  const plan = buildPlan(body as GeneratePlanRequest);

  return Response.json({ success: true, data: plan });
}
