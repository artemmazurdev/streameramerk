import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, Broadcast, User, Recording, StreamDestination } from '@types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем токен к каждому запросу
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Обработка ошибок
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/register', { email, password, name });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // Broadcasts
  async createBroadcast(data: Partial<Broadcast>): Promise<ApiResponse<Broadcast>> {
    const response = await this.api.post('/broadcasts', data);
    return response.data;
  }

  async getBroadcast(id: string): Promise<ApiResponse<Broadcast>> {
    const response = await this.api.get(`/broadcasts/${id}`);
    return response.data;
  }

  async getBroadcasts(userId?: string): Promise<ApiResponse<Broadcast[]>> {
    const response = await this.api.get('/broadcasts', {
      params: { userId },
    });
    return response.data;
  }

  async updateBroadcast(id: string, data: Partial<Broadcast>): Promise<ApiResponse<Broadcast>> {
    const response = await this.api.patch(`/broadcasts/${id}`, data);
    return response.data;
  }

  async deleteBroadcast(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/broadcasts/${id}`);
    return response.data;
  }

  async startBroadcast(id: string): Promise<ApiResponse<Broadcast>> {
    const response = await this.api.post(`/broadcasts/${id}/start`);
    return response.data;
  }

  async endBroadcast(id: string): Promise<ApiResponse<Broadcast>> {
    const response = await this.api.post(`/broadcasts/${id}/end`);
    return response.data;
  }

  // Stream Destinations
  async addDestination(broadcastId: string, destination: Partial<StreamDestination>): Promise<ApiResponse<StreamDestination>> {
    const response = await this.api.post(`/broadcasts/${broadcastId}/destinations`, destination);
    return response.data;
  }

  async removeDestination(broadcastId: string, destinationId: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/broadcasts/${broadcastId}/destinations/${destinationId}`);
    return response.data;
  }

  async testDestination(broadcastId: string, destinationId: string): Promise<ApiResponse<{ status: string }>> {
    const response = await this.api.post(`/broadcasts/${broadcastId}/destinations/${destinationId}/test`);
    return response.data;
  }

  // Recordings
  async getRecordings(userId?: string): Promise<ApiResponse<Recording[]>> {
    const response = await this.api.get('/recordings', {
      params: { userId },
    });
    return response.data;
  }

  async getRecording(id: string): Promise<ApiResponse<Recording>> {
    const response = await this.api.get(`/recordings/${id}`);
    return response.data;
  }

  async deleteRecording(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/recordings/${id}`);
    return response.data;
  }

  // Analytics
  async getBroadcastAnalytics(broadcastId: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/broadcasts/${broadcastId}/analytics`);
    return response.data;
  }

  // File Upload
  async uploadFile(file: File, type: 'logo' | 'overlay' | 'avatar'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ApiService();



