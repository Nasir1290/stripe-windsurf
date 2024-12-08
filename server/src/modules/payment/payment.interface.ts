export interface ICreatePaymentIntentRequest {
  amount: number;
  currency?: string;
  paymentMethodType?: string;
  metadata?: {
    orderId?: string;
    customerId?: string;
    productIds?: string[];
  };
}

export interface IPaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface IPaymentIntentParams {
  paymentIntentId: string;
}
