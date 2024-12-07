import express from 'express';
import { StripeController } from './stripe.controller';

const router = express.Router();

router.post('/create-payment-intent', StripeController.createPaymentIntent);
router.post('/create-product', StripeController.createProduct);
router.post('/create-price', StripeController.createPrice);
router.get('/payment-intent/:paymentIntentId', StripeController.retrievePaymentIntent);

// Checkout routes
router.post('/create-checkout-session', StripeController.createCheckoutSession);
router.get('/checkout-session/:sessionId', StripeController.retrieveCheckoutSession);

export const StripeRoutes = router;
