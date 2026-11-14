import apiClient from './api';

export const riskService = {
  async getRisks() {
    try {
      return await apiClient.get('/risks');
    } catch (e) {
      return null;
    }
  },

  async getShipmentRisks(shipmentId) {
    try {
      return await apiClient.get(`/risks/${shipmentId}`);
    } catch (e) {
      return null;
    }
  },
};

export default riskService;
