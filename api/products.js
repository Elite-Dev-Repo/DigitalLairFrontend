import api from "./api";

export const getRecentProducts = async () => {
  const response = await api.get("/recent_products/");
  return response.data.results;
};

export const getProducts = async () => {
  const response = await api.get(`/products/`);
  return response.data.results;
};

export const getCategories = async () => {
  const response = await api.get(`/category/`);
  return response.data.results;
};
