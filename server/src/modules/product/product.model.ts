import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stripeProductId: string;
  stripePriceId: string;
  images: string[];
  active: boolean;
}

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stripeProductId: { type: String, required: true },
  stripePriceId: { type: String, required: true },
  images: [{ type: String }],
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
