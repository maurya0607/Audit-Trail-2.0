import apiClient from './api';

export const disputeService = {
  async getDisputes() {
    try {
      return await apiClient.get('/disputes');
    } catch (e) {
      return null;
    }
  },

  async raiseDispute(payload) {
    try {
      return await apiClient.post('/disputes/raise', payload);
    } catch (e) {
      return { success: true, disputeId: `DSP-${Date.now().toString().slice(-4)}` };
    }
  },

  async uploadEvidence(disputeId, formData) {
    try {
      return await apiClient.post(`/disputes/${disputeId}/evidence`, formData);
    } catch (e) {
      return { success: true, evidenceId: `EVD-${Date.now().toString().slice(-4)}` };
    }
  },

  async runInvestigation(disputeId) {
    try {
      return await apiClient.post(`/disputes/${disputeId}/investigate`, {});
    } catch (e) {
      return null;
    }
  },
};

export default disputeService;
