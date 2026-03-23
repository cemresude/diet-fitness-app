// Chat Session modeli

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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CollectedData {
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  allergies?: string[];
  injuries?: string[];
}

export interface ChatSession {
  id: string;
  userId?: string;
  currentStep: ChatStep;
  collectedData: CollectedData;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSessionResponse {
  id: string;
  userId?: string;
  currentStep: ChatStep;
  collectedData: CollectedData;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const toChatSessionResponse = (session: ChatSession): ChatSessionResponse => ({
  id: session.id,
  userId: session.userId,
  currentStep: session.currentStep,
  collectedData: session.collectedData,
  messages: session.messages.map(m => ({
    ...m,
    timestamp: m.timestamp.toISOString(),
  })),
  createdAt: session.createdAt.toISOString(),
  updatedAt: session.updatedAt.toISOString(),
});
