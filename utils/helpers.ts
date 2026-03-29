// Yardımcı fonksiyonlar

import { UserGoal } from '../types/user';
import { GOAL_KEYWORDS } from './constants';

/**
 * Emojileri ve geniş pictographic karakterleri metinden kaldırır.
 */
export const stripEmojis = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[\uFE0F\u200D]/g, '') // variation selector + zero-width joiner
    .replace(/\s{2,}/g, ' ')
    .trim();
};

/**
 * Kullanıcı girişinden yaş değerini çıkarır
 */
export const extractAge = (input: string): number | null => {
  const matches = input.match(/\d+/);
  if (matches) {
    const age = parseInt(matches[0], 10);
    if (age >= 10 && age <= 120) {
      return age;
    }
  }
  return null;
};

/**
 * Kullanıcı girişinden kilo değerini çıkarır (kg)
 */
export const extractWeight = (input: string): number | null => {
  const matches = input.match(/\d+([.,]\d+)?/);
  if (matches) {
    const weight = parseFloat(matches[0].replace(',', '.'));
    if (weight >= 20 && weight <= 300) {
      return weight;
    }
  }
  return null;
};

/**
 * Kullanıcı girişinden boy değerini çıkarır (cm)
 */
export const extractHeight = (input: string): number | null => {
  const matches = input.match(/\d+([.,]\d+)?/);
  if (matches) {
    const height = parseFloat(matches[0].replace(',', '.'));
    // Metre cinsinden girilmiş olabilir
    if (height >= 1 && height <= 2.5) {
      return Math.round(height * 100);
    }
    // Cm cinsinden
    if (height >= 100 && height <= 250) {
      return Math.round(height);
    }
  }
  return null;
};

/**
 * Kullanıcı girişinden hedefi belirler
 */
export const extractGoal = (input: string): UserGoal | null => {
  const lowercaseInput = input.toLowerCase();
  
  for (const [goal, keywords] of Object.entries(GOAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowercaseInput.includes(keyword)) {
        return goal as UserGoal;
      }
    }
  }
  return null;
};

/**
 * Kullanıcı girişinden alerji listesini çıkarır
 */
export const extractAllergies = (input: string): string[] => {
  const lowercaseInput = input.toLowerCase();

  if (
    lowercaseInput.includes('yok') ||
    lowercaseInput.includes('hayır') ||
    lowercaseInput.trim() === '-'
  ) {
    return [];
  }

  const allergyDictionary: Record<string, string[]> = {
    egg: ['yumurta', 'egg'],
    peanut: ['fıstık', 'yer fıstığı', 'peanut'],
    milk: ['süt', 'milk'],
    lactose: ['laktoz', 'lactose'],
    gluten: ['gluten'],
    soy: ['soya', 'soy'],
    fish: ['balık', 'fish'],
    shellfish: ['kabuklu deniz ürünü', 'karides', 'midye', 'shellfish'],
    tree_nuts: ['badem', 'ceviz', 'fındık', 'tree nuts', 'nuts'],
    sesame: ['susam', 'sesame'],
  };

  const found = new Set<string>();
  Object.entries(allergyDictionary).forEach(([key, variants]) => {
    if (variants.some((variant) => lowercaseInput.includes(variant))) {
      found.add(key);
    }
  });

  // Sözlükte bulunamazsa, serbest girdiden sadece çekirdek kelimeleri ayıkla
  if (found.size === 0) {
    const stopwords = new Set([
      'i', 'have', 'an', 'a', 'to', 'allergy', 'allergic', 'am', 'im', 've', 'veya', 'ile', 'karşı',
      'alerjim', 'alerji', 'var', 'benim', 'yemem', 'yiyemem', 'için', 'bir', 'the', 'to', 'of', 'and',
    ]);

    const tokens = lowercaseInput
      .replace(/[^\p{L}\p{N}\s,]+/gu, ' ')
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2 && !stopwords.has(t));

    return Array.from(new Set(tokens));
  }

  return Array.from(found);
};

/**
 * Kullanıcı girişinden sakatlık listesini çıkarır
 */
export const extractInjuries = (input: string): string[] => {
  const lowercaseInput = input.toLowerCase();

  if (
    lowercaseInput.includes('yok') ||
    lowercaseInput.includes('hayır') ||
    lowercaseInput.trim() === '-'
  ) {
    return [];
  }

  const injuryDictionary: Record<string, string[]> = {
    knee: ['diz', 'knee'],
    shoulder: ['omuz', 'shoulder'],
    back: ['bel', 'sırt', 'back'],
    herniated_disc: ['fıtık', 'herniated disc', 'disk'],
    neck: ['boyun', 'neck'],
    ankle: ['bilek', 'ankle'],
    wrist: ['el bileği', 'wrist'],
    hypertension: ['tansiyon', 'hypertension'],
    diabetes: ['diyabet', 'diabetes'],
    heart_condition: ['kalp', 'heart'],
  };

  const found = new Set<string>();
  Object.entries(injuryDictionary).forEach(([key, variants]) => {
    if (variants.some((variant) => lowercaseInput.includes(variant))) {
      found.add(key);
    }
  });

  if (found.size === 0) {
    const stopwords = new Set([
      'i', 'have', 'an', 'a', 'injury', 'injuries', 'pain', 'am', 'im', 've', 'veya', 'ile', 'karşı',
      'sakatlık', 'sakatlığım', 'var', 'benim', 'the', 'to', 'of', 'and',
    ]);

    const tokens = lowercaseInput
      .replace(/[^\p{L}\p{N}\s,]+/gu, ' ')
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2 && !stopwords.has(t));

    return Array.from(new Set(tokens));
  }

  return Array.from(found);
};

/**
 * BMI hesapla
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

/**
 * BMI kategorisini belirle
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Zayıf';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Fazla Kilolu';
  return 'Obez';
};

/**
 * Günlük kalori ihtiyacını hesapla (Harris-Benedict formülü)
 */
export const calculateDailyCalories = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' = 'male',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' = 'moderate'
): number => {
  // BMR hesapla
  let bmr: number;
  if (gender === 'male') {
    bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  }
  
  // Aktivite çarpanı
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

/**
 * Tarih formatla
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Saat formatla
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
