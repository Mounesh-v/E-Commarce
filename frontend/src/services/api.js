import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addToCartApi = (data) => {
  const token = localStorage.getItem("token");

  return api.post("/cart/add", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getCartApi = () => {
  const token = localStorage.getItem("token");

  return api.get("/cart/get-cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateCartApi = (data) => api.put("/cart/update", data);
export const removeCartApi = (productId) =>
  api.delete(`/cart/remove/${productId}`);
export const clearCartApi = () => api.delete("/cart/clear");

export default api;
