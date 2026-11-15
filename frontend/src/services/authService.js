import apiClient from './api';

export const authService = {
  async login(email, password) {
    const data = await apiClient.post('/auth/login', { email, password });
    if (data.access_token) {
      localStorage.setItem('audit_trail_token', data.access_token);
    }
    return data;
  },

  async register(userData) {
    const data = await apiClient.post('/auth/register', userData);
    if (data.access_token) {
      localStorage.setItem('audit_trail_token', data.access_token);
    }
    return data;
  },

  async updateProfile(formData) {
    const payload = {
      name: formData.name,
      organization: formData.organization,
    };
    if (formData.password) {
      payload.password = formData.password;
    }
    return await apiClient.patch('/profile', payload);
  },

  logout() {
    localStorage.removeItem('audit_trail_token');
    localStorage.removeItem('audit_trail_user');
  },
};

export default authService;
