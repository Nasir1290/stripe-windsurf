import axios from 'axios';
import { ICreateCheckoutSession, ICreatePrice, ICreateProduct, IPaymentIntent } from '../types/stripe';

const API_BASE_URL = 'http://localhost:5000/api/v1/stripe';

export const stripeService = {
  createPaymentIntent: async (data: IPaymentIntent) => {
    const response = await axios.post(`${API_BASE_URL}/create-payment-intent`, data);
    return response.data;
  },

  createProduct: async (data: ICreateProduct) => {
    const response = await axios.post(`${API_BASE_URL}/create-product`, data);
    return response.data;
  },

  createPrice: async (data: ICreatePrice) => {
    const response = await axios.post(`${API_BASE_URL}/create-price`, data);
    return response.data;
  },

  retrievePaymentIntent: async (paymentIntentId: string) => {
    const response = await axios.get(`${API_BASE_URL}/payment-intent/${paymentIntentId}`);
    return response.data;
  },

  createCheckoutSession: async (data: ICreateCheckoutSession) => {
    const response = await axios.post(`${API_BASE_URL}/create-checkout-session`, data);
    return response.data;
  },

  retrieveCheckoutSession: async (sessionId: string) => {
    const response = await axios.get(`${API_BASE_URL}/checkout-session/${sessionId}`);
    return response.data;
  }
};
