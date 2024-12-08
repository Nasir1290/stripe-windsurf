/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICreatePaymentIntentRequest } from './payment.interface';
import { StripeService } from '../stripe/stripe.service';
import { Product } from '../product/product.model';
import { Types } from 'mongoose';

export class PaymentService {
  static async createPaymentWithOrder(data: {
    productIds: string[];
    customerId: string;
  }) {
    // 1. Validate and fetch products
    const products = await Product.find({
      _id: { $in: data.productIds.map(id => new Types.ObjectId(id)) }
    });

    if (!products.length) {
      throw new Error('No valid products found');
    }

    // 2. Calculate total amount
    const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

    // 3. Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 4. Create payment intent with metadata
    const paymentIntent = await StripeService.createPaymentIntent({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId,
        customerId: data.customerId,
        productIds: data.productIds,
      }
    });

    // 5. You might want to create an order record in your database here
    // await Order.create({
    //   _id: orderId,
    //   customerId: data.customerId,
    //   products: products.map(p => p._id),
    //   paymentIntentId: paymentIntent.id,
    //   amount: totalAmount,
    //   status: 'pending'
    // });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId
    };
  }

  static async handlePaymentSuccess(paymentIntent: {
    id: string;
    metadata: {
      orderId?: string;
      customerId?: string;
      productIds?: string[];
    };
  }) {
    if (!paymentIntent.metadata.orderId) {
      throw new Error('No order ID in payment metadata');
    }

    // Here you would:
    // 1. Update order status
    // await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
    //   status: 'paid',
    //   paidAt: new Date()
    // });

    // 2. Update inventory
    if (paymentIntent.metadata.productIds) {
      // await Product.updateMany(
      //   { _id: { $in: paymentIntent.metadata.productIds } },
      //   { $inc: { inventory: -1 } }
      // );
    }

    // 3. Could send confirmation email to customer
    if (paymentIntent.metadata.customerId) {
      // await EmailService.sendPaymentConfirmation(
      //   paymentIntent.metadata.customerId,
      //   paymentIntent.metadata.orderId
      // );
    }

    return {
      success: true,
      orderId: paymentIntent.metadata.orderId
    };
  }
}
