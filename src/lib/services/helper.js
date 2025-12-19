import axiosInstance from "../axios";

// Centralized API helpers for backend endpoints

export async function createMerchant(payload) {
  const resp = await axiosInstance.post("/merchants", payload);
  return resp.data;
}

export async function updateMerchant(id, payload) {
  const resp = await axiosInstance.patch(`/merchants/${id}`, payload);
  return resp.data;
}

export async function getMerchants(params = {}) {
  // params: { page, pageSize, search }
  const resp = await axiosInstance.get("/merchants", { params });
  return resp.data;
}

export default {
  createMerchant,
  updateMerchant,
};
