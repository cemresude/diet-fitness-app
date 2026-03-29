import { v4 as uuidv4 } from 'uuid';
import { collections } from '../config/firebase';
import { ChatSession, ChatStep, CollectedData, ChatMessage } from '../models/ChatSession';
import { validateAge, validateWeight, validateHeight, validateGoal, parseList } from '../utils/validators';
import { CONVERSATION_PROMPTS } from '../utils/prompts';
import { stripEmojis } from '../utils/textSanitizer';

export const chatService = {
  // Yeni oturum başlat
  createSession: async (userId?: string): Promise<ChatSession> => {
    const session: ChatSession = {
      id: uuidv4(),
      userId,
      currentStep: 'welcome',
      collectedData: {},
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Hoşgeldin mesajını ekle
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: stripEmojis(CONVERSATION_PROMPTS.greeting),
      timestamp: new Date(),
    };
    session.messages.push(welcomeMessage);
    session.currentStep = 'age';

    // Firestore'a kaydet
    await collections.chatSessions.doc(session.id).set(session);

    return session;
  },

  // Oturumu getir
  getSession: async (sessionId: string): Promise<ChatSession | null> => {
    const doc = await collections.chatSessions.doc(sessionId).get();
    if (!doc.exists) return null;
    
    const data = doc.data();
    return {
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
      messages: data?.messages?.map((m: any) => ({
        ...m,
        timestamp: m.timestamp?.toDate(),
      })),
    } as ChatSession;
  },

  // Mesaj işle
  processMessage: async (
    sessionId: string,
    userMessage: string
  ): Promise<{
    response: string;
    nextStep: ChatStep;
    isComplete: boolean;
    collectedData: CollectedData;
  }> => {
    const session = await chatService.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Kullanıcı mesajını ekle
    const sanitizedUserMessage = stripEmojis(userMessage);

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: sanitizedUserMessage,
      timestamp: new Date(),
    };
    session.messages.push(userMsg);

    let response: string;
    let nextStep: ChatStep = session.currentStep;
    let isComplete = false;

    // Adıma göre işle
    switch (session.currentStep) {
      case 'age': {
        const result = validateAge(sanitizedUserMessage);
        if (result.isValid) {
          session.collectedData.age = result.value;
          nextStep = 'weight';
          response = CONVERSATION_PROMPTS.transitions.toWeight(result.value);
        } else {
          response = CONVERSATION_PROMPTS.validationErrors.age;
        }
        break;
      }

      case 'weight': {
        const result = validateWeight(sanitizedUserMessage);
        if (result.isValid) {
          session.collectedData.weight = result.value;
          nextStep = 'height';
          response = CONVERSATION_PROMPTS.transitions.toHeight(result.value);
        } else {
          response = CONVERSATION_PROMPTS.validationErrors.weight;
        }
        break;
      }

      case 'height': {
        const result = validateHeight(sanitizedUserMessage);
        if (result.isValid) {
          session.collectedData.height = result.value;
          nextStep = 'goal';
          response = CONVERSATION_PROMPTS.transitions.toGoal(result.value);
        } else {
          response = CONVERSATION_PROMPTS.validationErrors.height;
        }
        break;
      }

      case 'goal': {
        const result = validateGoal(sanitizedUserMessage);
        if (result.isValid) {
          session.collectedData.goal = result.value;
          nextStep = 'allergies';
          response = CONVERSATION_PROMPTS.transitions.toAllergies();
        } else {
          response = CONVERSATION_PROMPTS.validationErrors.goal;
        }
        break;
      }

      case 'allergies': {
        session.collectedData.allergies = parseList(sanitizedUserMessage);
        nextStep = 'injuries';
        response = CONVERSATION_PROMPTS.transitions.toInjuries();
        break;
      }

      case 'injuries': {
        session.collectedData.injuries = parseList(sanitizedUserMessage);
        nextStep = 'confirmation';
        response = CONVERSATION_PROMPTS.confirmation(session.collectedData);
        break;
      }

      case 'confirmation': {
        const lowerMessage = sanitizedUserMessage.toLowerCase();
        if (lowerMessage.includes('evet') || lowerMessage.includes('onay') || lowerMessage.includes('tamam')) {
          nextStep = 'generating';
          response = CONVERSATION_PROMPTS.generating;
          isComplete = true;
        } else {
          // Baştan başla
          nextStep = 'age';
          session.collectedData = {};
          response = 'Tamam, baştan başlayalım. Kaç yaşındasınız?';
        }
        break;
      }

      default:
        response = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }

    // Bot yanıtını ekle
    const botMsg: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: stripEmojis(response),
      timestamp: new Date(),
    };
    session.messages.push(botMsg);
    session.currentStep = nextStep;
    session.updatedAt = new Date();

    // Firestore'u güncelle
    await collections.chatSessions.doc(sessionId).update({
      currentStep: nextStep,
      collectedData: session.collectedData,
      messages: session.messages,
      updatedAt: session.updatedAt,
    });

    return {
      response,
      nextStep,
      isComplete,
      collectedData: session.collectedData,
    };
  },

  // Oturumu sonlandır
  endSession: async (sessionId: string): Promise<void> => {
    await collections.chatSessions.doc(sessionId).update({
      currentStep: 'complete',
      updatedAt: new Date(),
    });
  },
};

export default chatService;
