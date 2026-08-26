import api from "./api";

export const getCart = async () => {
  const response = await api.get("/cart/");
  return response.data;
};

export const addToCart = async (productId, quantity) => {
  const response = await api.post("/cart_item/", {
    product: productId,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (cartItemId) => {
  await api.delete(`/cart_item/${cartItemId}/`);
};
