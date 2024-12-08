export interface ICreateProductRequest {
  name: string;
  description: string;
  price: number;
  images?: string[];
}

export interface ICheckoutRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
