import { Request, Response } from 'express';
import { Product } from './product.model';
import { StripeService } from '../stripe/stripe.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { ICheckoutRequest, ICreateProductRequest } from './product.interface';
import { Types } from 'mongoose';

const createProduct = catchAsync(async (req: Request<unknown, unknown, ICreateProductRequest>, res: Response) => {
  // 1. First create product in Stripe
  const stripeProduct = await StripeService.createProduct({
    name: req.body.name,
    description: req.body.description
  });

  // 2. Create price in Stripe
  const stripePrice = await StripeService.createPrice({
    amount: Math.round(req.body.price * 100), // Convert to cents and ensure integer
    currency: 'usd',
    product: stripeProduct.id
  });

  // 3. Save product in our database with Stripe IDs
  const product = await Product.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stripeProductId: stripeProduct.id,
    stripePriceId: stripePrice.id,
    images: req.body.images || []
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: product.toObject()
  });
});

const initiateCheckout = catchAsync(async (req: Request<unknown, unknown, ICheckoutRequest>, res: Response) => {
  const { items } = req.body;
  
  // 1. Fetch products from database
  const productIds = items.map(item => new Types.ObjectId(item.productId));
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  
  if (!products.length) {
    throw new Error('No products found');
  }

  // 2. Create line items for Stripe
  const lineItems = products.map(product => {
    const item = items.find(item => item.productId === product._id.toString());
    if (!item) {
      throw new Error(`Product ${product._id} not found in items`);
    }
    return {
      price: product.stripePriceId,
      quantity: item.quantity
    };
  });

  // 3. Create Stripe checkout session
  const session = await StripeService.createCheckoutSession({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/cart`
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout session created successfully',
    data: { sessionId: session.id }
  });
});

export const ProductController = {
  createProduct,
  initiateCheckout
};
