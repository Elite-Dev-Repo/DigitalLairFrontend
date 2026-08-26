import api from "./api";

export const getOrders = async () => {
  const response = await api.get("/order/");
  return response.data;
};

export const createOrder = async (metadata = {}) => {
  const response = await api.post("/order/", { metadata });
  return response.data;
};