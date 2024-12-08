import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

// Payment Intent routes
router.post('/create-intent', PaymentController.createPaymentIntent);
router.get('/intent/:paymentIntentId', PaymentController.retrievePaymentIntent);

// Webhook route - Note: This should be excluded from CORS and body parsing middleware
router.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook);

export const PaymentRoutes = router;
