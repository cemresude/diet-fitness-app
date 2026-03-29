import { geminiClient, openaiClient, getAIProvider } from '../config/ai';
import { SYSTEM_PROMPT, PLAN_GENERATION_PROMPT, USER_DATA_EXTRACTION_PROMPT } from '../utils/prompts';
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

const cleanModelOutput = (text: string): string => {
  return text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
};

const extractFirstJsonObject = (text: string): string => {
  const cleaned = cleanModelOutput(text);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model output does not contain valid JSON object boundaries');
  }

  return cleaned.slice(start, end + 1);
};

function assertGeneratedPlanShape(plan: any): asserts plan is GeneratedPlan {
  if (!plan || typeof plan !== 'object') {
    throw new Error('Plan JSON is not an object');
  }

  if (!plan.dietPlan || typeof plan.dietPlan !== 'object') {
    throw new Error('dietPlan is missing');
  }

  if (!plan.workoutPlan || typeof plan.workoutPlan !== 'object') {
    throw new Error('workoutPlan is missing');
  }

  if (!Array.isArray(plan.dietPlan.weeklyMenu)) {
    throw new Error('dietPlan.weeklyMenu must be an array');
  }

  if (!Array.isArray(plan.workoutPlan.weeklySchedule)) {
    throw new Error('workoutPlan.weeklySchedule must be an array');
  }
}

const getMissingFields = (userProfile: UserProfile): string[] => {
  const missing: string[] = [];
  if (!userProfile.age) missing.push('age');
  if (!userProfile.height) missing.push('height');
  if (!userProfile.weight) missing.push('weight');
  if (!userProfile.goal) missing.push('goal');
  if (!Array.isArray(userProfile.allergies)) missing.push('allergies');
  if (!Array.isArray(userProfile.injuries)) missing.push('injuries');
  return missing;
};

export const aiService = {
  // Plan oluştur
  generatePlan: async (userProfile: UserProfile): Promise<GeneratedPlan> => {
    const missingFields = getMissingFields(userProfile);
    if (missingFields.length > 0) {
      throw new Error(`Eksik kullanıcı bilgileri: ${missingFields.join(', ')}`);
    }

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

      // JSON'u parse et (markdown code fence durumunu da temizle)
      const jsonString = extractFirstJsonObject(response);
      const plan = JSON.parse(jsonString);
      assertGeneratedPlanShape(plan);

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

  // Mesajdan alerji/sakatlık anahtarlarını JSON olarak ayıkla
  extractUserHealthData: async (
    message: string
  ): Promise<{ allergies: string[]; injuries: string[] }> => {
    const provider = getAIProvider();
    const prompt = USER_DATA_EXTRACTION_PROMPT(message);

    try {
      const raw =
        provider === 'gemini' && geminiClient
          ? await generateWithGemini(prompt)
          : provider === 'openai' && openaiClient
          ? await generateWithOpenAI(prompt)
          : (() => {
              throw new Error('AI provider not available');
            })();

      const jsonString = (() => {
        try {
          return extractFirstJsonObject(raw);
        } catch {
          return null;
        }
      })();

      if (!jsonString) {
        return { allergies: [], injuries: [] };
      }

      const parsed = JSON.parse(jsonString) as {
        allergies?: string[];
        injuries?: string[];
      };

      return {
        allergies: Array.isArray(parsed.allergies)
          ? parsed.allergies.map((x) => String(x).trim().toLowerCase()).filter(Boolean)
          : [],
        injuries: Array.isArray(parsed.injuries)
          ? parsed.injuries.map((x) => String(x).trim().toLowerCase()).filter(Boolean)
          : [],
      };
    } catch (error) {
      console.error('AI extraction error:', error);
      return { allergies: [], injuries: [] };
    }
  },
};

// Gemini ile yanıt oluştur
async function generateWithGemini(prompt: string): Promise<string> {
  if (!geminiClient) throw new Error('Gemini client not initialized');

  // Model adını ortam değişkeninden oku; yoksa yaygın desteklenen bir varsayılan kullan
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const model = geminiClient.getGenerativeModel({ model: geminiModel });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// OpenAI ile yanıt oluştur
async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!openaiClient) throw new Error('OpenAI client not initialized');

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
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
