/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StripeService } from '../stripe/stripe.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { ICreatePaymentIntentRequest, IPaymentIntentParams } from './payment.interface';
import Stripe from 'stripe';

const createPaymentIntent = catchAsync<unknown, any, ICreatePaymentIntentRequest>(
  async (req: Request<unknown, any, ICreatePaymentIntentRequest>, res: Response) => {
    const { amount, currency = 'usd', paymentMethodType = 'card', metadata } = req.body;

    // Validate amount
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // 1. Create a payment intent
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: [paymentMethodType],
      metadata // Additional information about the payment
    });

    // 2. Send the client secret to the client
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment intent created successfully',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  }
);

const retrievePaymentIntent = catchAsync<IPaymentIntentParams>(
  async (req: Request<IPaymentIntentParams>, res: Response) => {
    const { paymentIntentId } = req.params;

    const paymentIntent = await StripeService.retrievePaymentIntent(paymentIntentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment intent retrieved successfully',
      data: paymentIntent
    });
  }
);

// Handle webhook events for payment status updates
const handleWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      throw new Error('Missing stripe signature or endpoint secret');
    }

    let event: Stripe.Event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2024-11-20.acacia'
      });
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        // Handle successful payment
        // Update order status, send confirmation email, etc.
        // You might want to:
        // 1. Update order status in your database
        // 2. Send confirmation email
        // 3. Trigger inventory updates
        // 4. Create shipping labels
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed for PaymentIntent ${paymentIntent.id}`);
        // Handle failed payment
        // You might want to:
        // 1. Update order status
        // 2. Notify customer
        // 3. Trigger retry logic if applicable
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent ${paymentIntent.id} is processing`);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent ${paymentIntent.id} was canceled`);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Webhook handled successfully',
      data: null
    });
  }
);

export const PaymentController = {
  createPaymentIntent,
  retrievePaymentIntent,
  handleWebhook
};
