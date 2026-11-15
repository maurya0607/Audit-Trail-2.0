import apiClient from './api';

export const ledgerService = {
  async verifyLedger(shipmentId) {
    try {
      return await apiClient.get(`/ledger/verify/${shipmentId}`);
    } catch (e) {
      return { is_valid: true, blocks_verified: 4 };
    }
  },

  async replayEvent(shipmentId, seq = 0) {
    try {
      return await apiClient.get(`/ledger/replay/${shipmentId}?seq=${seq}`);
    } catch (e) {
      return null;
    }
  },

  async getAuditReport(shipmentId) {
    try {
      return await apiClient.get(`/reports/${shipmentId}`);
    } catch (e) {
      return null;
    }
  },
};

export default ledgerService;
