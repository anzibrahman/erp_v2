// src/api/services/outstanding.service.js
import api from "../client/apiClient";

export const outstandingService = {
  getPartyOutstanding: async ({
    partyId,
    cmp_id,
    page,
    limit,
    signal,
    skipGlobalLoader,
  }) => {
    const res = await api.get(`/outstanding/party/${partyId}`, {
      params: { cmp_id, page, limit },
      signal,
      skipGlobalLoader,
    });
    return res.data;
  },
};

