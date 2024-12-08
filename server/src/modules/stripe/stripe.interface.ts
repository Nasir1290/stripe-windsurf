export type IPaymentIntent = {
  amount: number;
  currency: string;
  payment_method_types?: string[];
  description?: string;
  metadata?: {
    orderId?: string;
    customerId?: string;
    productIds?: string[];
    [key: string]: string | string[] | undefined;
  };
};

export type ICreatePrice = {
  amount: number;
  currency: string;
  product: string;
};

export type ICreateProduct = {
  name: string;
  description?: string;
};

export type ICreateCheckoutSession = {
  line_items: Array<{
    price_data?: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
      };
      unit_amount: number;
    };
    price?: string;
    quantity: number;
  }>;
  success_url: string;
  cancel_url: string;
  mode: 'payment' | 'subscription';
};
