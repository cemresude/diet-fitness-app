// Validation helper fonksiyonları

export interface ValidationResult {
  isValid: boolean;
  value?: any;
  error?: string;
}

export const validateAge = (input: string): ValidationResult => {
  const matches = input.match(/\d+/);
  if (matches) {
    const age = parseInt(matches[0], 10);
    if (age >= 10 && age <= 120) {
      return { isValid: true, value: age };
    }
  }
  return { isValid: false, error: 'Geçerli bir yaş girmeniz gerekiyor (10-120 arası)' };
};

export const validateWeight = (input: string): ValidationResult => {
  const matches = input.match(/\d+([.,]\d+)?/);
  if (matches) {
    const weight = parseFloat(matches[0].replace(',', '.'));
    if (weight >= 20 && weight <= 300) {
      return { isValid: true, value: weight };
    }
  }
  return { isValid: false, error: 'Geçerli bir kilo girmeniz gerekiyor (20-300 kg arası)' };
};

export const validateHeight = (input: string): ValidationResult => {
  const matches = input.match(/\d+([.,]\d+)?/);
  if (matches) {
    const height = parseFloat(matches[0].replace(',', '.'));
    // Metre cinsinden girilmiş olabilir
    if (height >= 1 && height <= 2.5) {
      return { isValid: true, value: Math.round(height * 100) };
    }
    // Cm cinsinden
    if (height >= 100 && height <= 250) {
      return { isValid: true, value: Math.round(height) };
    }
  }
  return { isValid: false, error: 'Geçerli bir boy girmeniz gerekiyor (100-250 cm arası)' };
};

const GOAL_KEYWORDS: Record<string, string[]> = {
  weight_loss: ['kilo ver', 'zayıfla', 'yağ yak', 'incle', 'kilo kaybet', 'zayıflama'],
  weight_gain: ['kilo al', 'kilo kazan', 'şişmanla', 'kilo artır'],
  muscle_building: ['kas yap', 'kas kazan', 'güçlen', 'fit ol', 'kaslı', 'kas', 'fitness'],
  maintenance: ['koru', 'aynı kal', 'dengele', 'sürdür', 'koruma'],
};

export const validateGoal = (input: string): ValidationResult => {
  const lowercaseInput = input.toLowerCase();
  
  for (const [goal, keywords] of Object.entries(GOAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowercaseInput.includes(keyword)) {
        return { isValid: true, value: goal };
      }
    }
  }
  return { 
    isValid: false, 
    error: 'Hedefinizi anlayamadım. Lütfen kilo verme, kilo alma, kas yapma veya koruma şeklinde belirtin.' 
  };
};

export const parseList = (input: string): string[] => {
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
    .filter((item) => item.length > 1);
  
  return items;
};

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return { isValid: true, value: email };
  }
  return { isValid: false, error: 'Geçerli bir e-posta adresi giriniz' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (password.length >= 6) {
    return { isValid: true, value: password };
  }
  return { isValid: false, error: 'Şifre en az 6 karakter olmalıdır' };
};
