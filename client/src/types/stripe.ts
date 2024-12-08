export interface IPaymentIntent {
  amount: number;
  currency: string;
  payment_method_types?: string[];
  description?: string;
}

export interface ICreateProduct {
  name: string;
  description?: string;
}

export interface ICreatePrice {
  amount: number;
  currency: string;
  product: string;
}

export interface ILineItem {
  price: string;
  quantity: number;
}

export interface ICreateCheckoutSession {
  line_items: ILineItem[];
  mode: 'payment' | 'subscription';
  success_url: string;
  cancel_url: string;
}
