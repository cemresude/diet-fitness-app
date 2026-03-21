import { geminiClient, openaiClient, getAIProvider } from '../config/ai';
import { SYSTEM_PROMPT, PLAN_GENERATION_PROMPT } from '../utils/prompts';
import { DietPlan, WorkoutPlan } from '../models/Plan';

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
  allergies: string[];
  injuries: string[];
}

interface GeneratedPlan {
  dietPlan: DietPlan;
  workoutPlan: WorkoutPlan;
}

export const aiService = {
  // Plan oluştur
  generatePlan: async (userProfile: UserProfile): Promise<GeneratedPlan> => {
    const provider = getAIProvider();
    const prompt = PLAN_GENERATION_PROMPT(userProfile);

    try {
      let response: string;

      if (provider === 'gemini' && geminiClient) {
        response = await generateWithGemini(prompt);
      } else if (provider === 'openai' && openaiClient) {
        response = await generateWithOpenAI(prompt);
      } else {
        throw new Error('AI provider not available');
      }

      // JSON'u parse et
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const plan = JSON.parse(jsonMatch[0]) as GeneratedPlan;
      return plan;
    } catch (error) {
      console.error('AI plan generation error:', error);
      throw new Error('Plan oluşturulurken bir hata oluştu');
    }
  },

  // Sohbet yanıtı al
  getChatResponse: async (message: string, context: string): Promise<string> => {
    const provider = getAIProvider();
    const prompt = `${SYSTEM_PROMPT}\n\nKonuşma bağlamı: ${context}\n\nKullanıcı: ${message}\n\nAsistan:`;

    try {
      if (provider === 'gemini' && geminiClient) {
        return await generateWithGemini(prompt);
      } else if (provider === 'openai' && openaiClient) {
        return await generateWithOpenAI(prompt);
      } else {
        throw new Error('AI provider not available');
      }
    } catch (error) {
      console.error('AI chat response error:', error);
      throw new Error('Yanıt oluşturulurken bir hata oluştu');
    }
  },
};

// Gemini ile yanıt oluştur
async function generateWithGemini(prompt: string): Promise<string> {
  if (!geminiClient) throw new Error('Gemini client not initialized');

  // Model adını ortam değişkeninden oku; yoksa yaygın desteklenen bir varsayılan kullan
  // Not: @google/generative-ai için genelde 'gemini-1.0-pro' veya 'gemini-pro' modelleri kullanılır.
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.0-pro';
  const model = geminiClient.getGenerativeModel({ model: geminiModel });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// OpenAI ile yanıt oluştur
async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!openaiClient) throw new Error('OpenAI client not initialized');

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return completion.choices[0].message.content || '';
}

export default aiService;
