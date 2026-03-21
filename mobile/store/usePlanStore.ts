import { create } from 'zustand';
import { Plan, DietPlan, WorkoutPlan } from '../types/plan';

interface PlanState {
  currentPlan: Plan | null;
  planHistory: Plan[];
  isGenerating: boolean;
  generationProgress: number;
  error: string | null;
  
  // Actions
  setCurrentPlan: (plan: Plan) => void;
  addToPlanHistory: (plan: Plan) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  clearCurrentPlan: () => void;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  currentPlan: null,
  planHistory: [],
  isGenerating: false,
  generationProgress: 0,
  error: null,

  setCurrentPlan: (plan) => {
    set({ currentPlan: plan, error: null });
    // Geçmişe de ekle
    get().addToPlanHistory(plan);
  },

  addToPlanHistory: (plan) => {
    set((state) => ({
      planHistory: [plan, ...state.planHistory].slice(0, 10), // Son 10 planı tut
    }));
  },

  setIsGenerating: (isGenerating) => {
    set({ isGenerating, generationProgress: isGenerating ? 0 : 100 });
  },

  setGenerationProgress: (progress) => {
    set({ generationProgress: progress });
  },

  setError: (error) => {
    set({ error, isGenerating: false });
  },

  clearCurrentPlan: () => {
    set({ currentPlan: null });
  },
}));
