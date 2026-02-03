import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8083/api/orders";

export const createOrder = (orderData) => {
  return axios.post(BASE_URL, orderData);
};

export const getAllOrders = () => {
  return axios.get(BASE_URL);
};

export const filterOrders = (params) => {
  return axios.get(`${BASE_URL}/filter`, { params });
};

export const assignDelivery = (maxDistance) => {
  return axios.post(`${BASE_URL}/assign`, { maxDistance });
};

export const deleteOrder = (orderId) => {
  return axios.delete(`${BASE_URL}/${orderId}`);
};
