import apiClient from './api';

export const shipmentService = {
  async getShipments() {
    try {
      return await apiClient.get('/shipments');
    } catch (e) {
      return null; // Signals component to use seeded context data
    }
  },

  async getShipmentById(id) {
    try {
      return await apiClient.get(`/shipments/${id}`);
    } catch (e) {
      return null;
    }
  },

  async createShipment(shipmentData) {
    try {
      return await apiClient.post('/shipments', shipmentData);
    } catch (e) {
      return shipmentData;
    }
  },

  async getTimeline(id) {
    try {
      return await apiClient.get(`/shipments/${id}/timeline`);
    } catch (e) {
      return null;
    }
  },
};

export default shipmentService;
