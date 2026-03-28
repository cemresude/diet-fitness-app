import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { config } from './index';

// Gemini Client
export const geminiClient = config.ai.geminiApiKey
  ? new GoogleGenerativeAI(config.ai.geminiApiKey)
  : null;

// OpenAI Client
export const openaiClient = config.ai.openaiApiKey
  ? new OpenAI({ apiKey: config.ai.openaiApiKey })
  : null;

// Aktif AI provider'ı al
export const getAIProvider = () => {
  if (config.ai.provider === 'openai' && openaiClient) {
    return 'openai';
  }
  if (config.ai.provider === 'gemini' && geminiClient) {
    return 'gemini';
  }
  throw new Error('No AI provider configured');
};

export default { geminiClient, openaiClient, getAIProvider };
