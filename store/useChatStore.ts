import { create } from 'zustand';
import { ChatMessage, ChatStep, CollectedUserData, BOT_USER, CURRENT_USER } from '../types/chat';

interface ChatState {
  messages: ChatMessage[];
  currentStep: ChatStep;
  collectedData: CollectedUserData;
  isTyping: boolean;
  sessionId: string | null;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, '_id' | 'createdAt'>) => void;
  addBotMessage: (text: string, quickReplies?: ChatMessage['quickReplies']) => void;
  addUserMessage: (text: string) => void;
  setCurrentStep: (step: ChatStep) => void;
  updateCollectedData: (data: Partial<CollectedUserData>) => void;
  setIsTyping: (isTyping: boolean) => void;
  setSessionId: (id: string) => void;
  resetChat: () => void;
  initializeChat: () => void;
}

const generateId = () => Math.random().toString(36).substring(7);

const INITIAL_STATE = {
  messages: [],
  currentStep: 'welcome' as ChatStep,
  collectedData: {},
  isTyping: false,
  sessionId: null,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...INITIAL_STATE,

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      _id: generateId(),
      createdAt: new Date(),
    };
    set((state) => ({
      messages: [newMessage, ...state.messages],
    }));
  },

  addBotMessage: (text, quickReplies) => {
    get().addMessage({
      text,
      user: BOT_USER,
      quickReplies,
    });
  },

  addUserMessage: (text) => {
    get().addMessage({
      text,
      user: CURRENT_USER,
    });
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  updateCollectedData: (data) => {
    set((state) => ({
      collectedData: {
        ...state.collectedData,
        ...data,
      },
    }));
  },

  setIsTyping: (isTyping) => {
    set({ isTyping });
  },

  setSessionId: (id) => {
    set({ sessionId: id });
  },

  resetChat: () => {
    set(INITIAL_STATE);
  },

  initializeChat: () => {
    const { addBotMessage, setCurrentStep } = get();
    
    // Hoşgeldin mesajı
    setTimeout(() => {
      addBotMessage(
        'Merhaba! Ben senin kişisel fitness ve beslenme asistanınım. ' +
        'Sana özel bir diyet ve antrenman programı oluşturmak için birkaç soru soracağım.',
      );
      
      setTimeout(() => {
        addBotMessage('Başlamadan önce, kaç yaşında olduğunu öğrenebilir miyim?');
        setCurrentStep('age');
      }, 1000);
    }, 500);
  },
}));
