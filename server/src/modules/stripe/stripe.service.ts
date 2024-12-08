import Stripe from "stripe";
import {
  ICreateCheckoutSession,
  ICreatePrice,
  ICreateProduct,
  IPaymentIntent,
} from "./stripe.interface";
import config from "../../config";

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2024-11-20.acacia",
});

const createPaymentIntent = async (payload: IPaymentIntent) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: payload.amount,
    currency: payload.currency,
    payment_method_types: payload.payment_method_types || ["card"],
    description: payload.description,
  });

  return paymentIntent;
};

const createProduct = async (payload: ICreateProduct) => {
  const product = await stripe.products.create({
    name: payload.name,
    description: payload.description,
  });

  return product;
};

const createPrice = async (payload: ICreatePrice) => {
  const price = await stripe.prices.create({
    unit_amount: payload.amount,
    currency: payload.currency,
    product: payload.product,
  });

  return price;
};

const retrievePaymentIntent = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

const createCheckoutSession = async (payload: ICreateCheckoutSession) => {
  console.log("hit");
  const session = await stripe.checkout.sessions.create({
    line_items: payload.line_items,
    mode: payload.mode,
    success_url: payload.success_url,
    cancel_url: payload.cancel_url,
  });
  return session;
};

const retrieveCheckoutSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

export const StripeService = {
  createPaymentIntent,
  createProduct,
  createPrice,
  retrievePaymentIntent,
  createCheckoutSession,
  retrieveCheckoutSession,
};
