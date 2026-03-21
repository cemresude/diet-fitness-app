// Yardımcı fonksiyonlar

import { UserGoal } from '../types/user';
import { GOAL_KEYWORDS } from './constants';

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
    lowercaseInput === '-'
  ) {
    return [];
  }
  
  // Virgül veya "ve" ile ayrılmış listeyi parse et
  const items = input
    .split(/[,\s]+(?:ve\s+)?/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  
  return items;
};

/**
 * Kullanıcı girişinden sakatlık listesini çıkarır
 */
export const extractInjuries = (input: string): string[] => {
  return extractAllergies(input); // Aynı mantık
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
