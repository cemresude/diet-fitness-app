// Uygulama sabitleri

export const APP_NAME = 'Diet & Fitness AI';
export const APP_VERSION = '1.0.0';

// Renk paleti
export const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  primaryLight: '#C8E6C9',
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  accent: '#03A9F4',
  
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#F44336',
  warning: '#FFC107',
  success: '#4CAF50',
  info: '#2196F3',
  
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  
  border: '#E0E0E0',
  divider: '#BDBDBD',
  
  // Chat specific
  chatBubbleUser: '#4CAF50',
  chatBubbleBot: '#FFFFFF',
  chatBackground: '#E8F5E9',
};

// Sohbet adımları ve soruları
export const CHAT_QUESTIONS: Record<string, string> = {
  age: 'Kaç yaşındasın?',
  weight: 'Şu anki kilonuz kaç kg?',
  height: 'Boyunuz kaç cm?',
  goal: 'Hedefiniz nedir? (Kilo verme, kilo alma, kas yapma veya koruma)',
  allergies: 'Herhangi bir besin alerjiniz var mı? (Yoksa "yok" yazabilirsiniz)',
  injuries: 'Herhangi bir sakatlık veya sağlık sorununuz var mı? (Yoksa "yok" yazabilirsiniz)',
  confirmation: 'Bilgilerinizi onaylıyor musunuz? Planınızı oluşturmaya başlayabilir miyim?',
};

// Hedef türleri
export const GOAL_KEYWORDS = {
  weight_loss: ['kilo ver', 'zayıfla', 'yağ yak', 'incle', 'kilo kaybet'],
  weight_gain: ['kilo al', 'kilo kazan', 'şişmanla', 'kilo artır'],
  muscle_building: ['kas yap', 'kas kazan', 'güçlen', 'fit ol', 'kaslı'],
  maintenance: ['koru', 'aynı kal', 'dengele', 'sürdür'],
};

// Yaygın alerjiler
export const COMMON_ALLERGIES = [
  'Gluten',
  'Laktoz',
  'Fıstık',
  'Kabuklu deniz ürünleri',
  'Yumurta',
  'Soya',
  'Balık',
  'Kuruyemiş',
];

// Yaygın sakatlıklar
export const COMMON_INJURIES = [
  'Diz sorunu',
  'Bel fıtığı',
  'Omuz sorunu',
  'Bilek sorunu',
  'Boyun fıtığı',
  'Kalp rahatsızlığı',
  'Tansiyon',
  'Diyabet',
];

// API Endpoints
export const ENDPOINTS = {
  CHAT: {
    START: '/chat/start',
    MESSAGE: '/chat/message',
    HISTORY: '/chat/history',
    END: '/chat/end',
  },
  USER: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    PROFILE: '/users/profile',
  },
  PLAN: {
    GENERATE: '/plan',
    GET: '/plan',
    HISTORY: '/plan',
    EXPORT: '/plan',
  },
};
