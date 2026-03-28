import api, { ApiResponse } from './api';
import { Plan, GeneratePlanRequest } from '../types/plan';
import { ENDPOINTS } from '../utils/constants';

export const planService = {
  // Plan oluştur
  generatePlan: async (data: GeneratePlanRequest): Promise<ApiResponse<Plan>> => {
    const response = await api.post(ENDPOINTS.PLAN.GENERATE, data);
    return response.data;
  },

  // Belirli bir planı getir
  getPlan: async (planId: string): Promise<ApiResponse<Plan>> => {
    const response = await api.get(`${ENDPOINTS.PLAN.GET}/${planId}`);
    return response.data;
  },

  // Plan geçmişini getir
  getPlanHistory: async (): Promise<ApiResponse<Plan[]>> => {
    const response = await api.get(ENDPOINTS.PLAN.HISTORY);
    return response.data;
  },

  // Planı PDF olarak indir
  downloadPlanPDF: async (planId: string): Promise<Blob> => {
    const response = await api.get(`${ENDPOINTS.PLAN.GET}/${planId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Planı takvime aktar
  exportToCalendar: async (planId: string): Promise<ApiResponse<{ icsUrl: string }>> => {
    const response = await api.post(`${ENDPOINTS.PLAN.GET}/${planId}/export-calendar`);
    return response.data;
  },
};

export default planService;
