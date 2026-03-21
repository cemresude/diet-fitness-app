// Sohbet ile ilgili tipler

export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: ChatUser;
  image?: string;
  quickReplies?: QuickReply[];
  system?: boolean;
}

export interface ChatUser {
  _id: string | number;
  name: string;
  avatar?: string;
}

export interface QuickReply {
  type: 'radio' | 'checkbox';
  value: string;
  title: string;
}

export type ChatStep = 
  | 'welcome'
  | 'age'
  | 'weight'
  | 'height'
  | 'goal'
  | 'allergies'
  | 'injuries'
  | 'confirmation'
  | 'generating'
  | 'complete';

export interface ChatSession {
  id: string;
  userId: string;
  currentStep: ChatStep;
  collectedData: CollectedUserData;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectedUserData {
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  allergies?: string[];
  injuries?: string[];
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
  context?: {
    step: ChatStep;
  };
}

export interface SendMessageResponse {
  message: string;
  nextStep: ChatStep;
  isComplete: boolean;
  extractedData?: Partial<CollectedUserData>;
}

// Bot kullanıcısı için sabit değerler
export const BOT_USER: ChatUser = {
  _id: 'bot',
  name: 'Fitness AI',
  avatar: 'https://ui-avatars.com/api/?name=AI&background=4CAF50&color=fff',
};

export const CURRENT_USER: ChatUser = {
  _id: 'user',
  name: 'Ben',
};
