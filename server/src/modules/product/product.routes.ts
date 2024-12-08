import express from 'express';
import { ProductController } from './product.controller';

const router = express.Router();

// Admin routes (should be protected)
router.post('/create', ProductController.createProduct);

// Customer routes
router.post('/checkout', ProductController.initiateCheckout);

export const ProductRoutes = router;
