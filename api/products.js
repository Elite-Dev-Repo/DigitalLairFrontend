import api from "./api";

export const getRecentProducts = async () => {
  const response = await api.get("/recent_products/");
  return response.data.results;
};

export const getProducts = async () => {
  // Fetch all products (bypass default pagination) for use-cases like cart lookup
  const response = await api.get(`/products/?page_size=50`);
  // Support both paginated {results} and non-paginated array responses
  return response.data.results ?? response.data;
};

export const getPaginatedProducts = async ({ page = 1, pageSize = 6, category } = {}) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("page_size", String(pageSize));
  if (category && category !== "all") {
    params.append("category", category);
  }
  const response = await api.get(`/products/?${params.toString()}`);
  return response.data; // { count, next, previous, results }
};

export const getCategories = async () => {
  const response = await api.get(`/category/`);
  return response.data.results;
};
