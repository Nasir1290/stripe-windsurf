/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from '../product/product.model';
import { StripeService } from '../stripe/stripe.service';
import { Types } from 'mongoose';

interface CartItem {
  productId: string;
  quantity: number;
}

export class CheckoutService {
  static async createCheckoutSession(items: CartItem[], customerId: string) {
    // 1. Fetch products from database
    const productIds = items.map(item => new Types.ObjectId(item.productId));
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products.length) {
      throw new Error('No products found');
    }

    // 2. Create line items for Stripe Checkout
    const line_items = products.map(product => {
      const cartItem = items.find(item => item.productId === (product as {_id:string}).toString());
      
      if (!cartItem) {
        throw new Error(`Cart item not found for product ${product._id}`);
      }

      // If product has a Stripe Price ID, use that
      if (product.stripePriceId) {
        return {
          price: product.stripePriceId,
          quantity: cartItem.quantity
        };
      }

      // Otherwise, create price data on the fly
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images
          },
          unit_amount: Math.round(product.price * 100) // Convert to cents
        },
        quantity: cartItem.quantity
      };
    });

    // 3. Create checkout session
    const session = await StripeService.createCheckoutSession({
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url
    };
  }

  static async handleSuccessfulCheckout(sessionId: string) {
    const session = await StripeService.retrieveCheckoutSession(sessionId);
    
    // Here you might want to:
    // 1. Update order status
    // 2. Update inventory
    // 3. Send confirmation email
    // 4. Create shipping label
    
    return session;
  }
}
