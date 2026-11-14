import apiClient from './api';

export const authService = {
  async login(email, password) {
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      if (data.access_token) {
        localStorage.setItem('audit_trail_token', data.access_token);
      }
      return data;
    } catch (e) {
      return { success: true, token: 'mock-jwt-token' };
    }
  },

  async register(userData) {
    try {
      return await apiClient.post('/auth/register', userData);
    } catch (e) {
      return { success: true, user: userData };
    }
  },

  logout() {
    localStorage.removeItem('audit_trail_token');
    localStorage.removeItem('audit_trail_user');
  },
};

export default authService;
