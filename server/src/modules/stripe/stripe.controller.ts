import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { StripeService } from './stripe.service';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const result = await StripeService.createPaymentIntent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await StripeService.createProduct(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const createPrice = catchAsync(async (req: Request, res: Response) => {
  const result = await StripeService.createPrice(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Price created successfully',
    data: result,
  });
});

const retrievePaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { paymentIntentId } = req.params;
  const result = await StripeService.retrievePaymentIntent(paymentIntentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent retrieved successfully',
    data: result,
  });
});

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const result = await StripeService.createCheckoutSession(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout session created successfully',
    data: result,
  });
});

const retrieveCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const result = await StripeService.retrieveCheckoutSession(sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout session retrieved successfully',
    data: result,
  });
});

export const StripeController = {
  createPaymentIntent,
  createProduct,
  createPrice,
  retrievePaymentIntent,
  createCheckoutSession,
  retrieveCheckoutSession,
};
