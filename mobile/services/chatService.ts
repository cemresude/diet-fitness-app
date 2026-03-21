import api, { ApiResponse } from './api';
import { SendMessageRequest, SendMessageResponse, ChatSession } from '../types/chat';

export const chatService = {
  // Yeni sohbet oturumu başlat
  startSession: async (): Promise<ApiResponse<{ sessionId: string }>> => {
    const response = await api.post('/chat/start');
    return response.data;
  },

  // Mesaj gönder ve yanıt al
  sendMessage: async (data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> => {
    const response = await api.post('/chat/message', data);
    return response.data;
  },

  // Sohbet geçmişini getir
  getHistory: async (sessionId: string): Promise<ApiResponse<ChatSession>> => {
    const response = await api.get(`/chat/history/${sessionId}`);
    return response.data;
  },

  // Oturumu sonlandır
  endSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/chat/end/${sessionId}`);
    return response.data;
  },
};

export default chatService;
