'use client';

import { useState } from 'react';
import { stripeService } from '../services/stripeService';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const createPaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await stripeService.createPaymentIntent({
        amount: Number(formData.get('amount')),
        currency: formData.get('currency') as string,
        description: formData.get('description') as string,
      });
      setResult(result);
    } catch (error) {
      console.error(error);
      setResult(error);
    }
    setLoading(false);
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await stripeService.createProduct({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
      });
      setResult(result);
    } catch (error) {
      console.error(error);
      setResult(error);
    }
    setLoading(false);
  };

  const createPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await stripeService.createPrice({
        amount: Number(formData.get('amount')),
        currency: formData.get('currency') as string,
        product: formData.get('product') as string,
      });
      setResult(result);
    } catch (error) {
      console.error(error);
      setResult(error);
    }
    setLoading(false);
  };

  const createCheckoutSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const result = await stripeService.createCheckoutSession({
        line_items: [{
          price: formData.get('price') as string,
          quantity: Number(formData.get('quantity')),
        }],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
      setResult(result);
      // Redirect to Stripe Checkout
      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      console.error(error);
      setResult(error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Stripe API Testing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Intent Form */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Payment Intent</h2>
          <form onSubmit={createPaymentIntent} className="space-y-4">
            <div>
              <label className="block mb-1">Amount (in cents)</label>
              <input type="number" name="amount" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1">Currency</label>
              <input type="text" name="currency" defaultValue="usd" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <input type="text" name="description" className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
              {loading ? 'Processing...' : 'Create Payment Intent'}
            </button>
          </form>
        </div>

        {/* Product Form */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Product</h2>
          <form onSubmit={createProduct} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input type="text" name="name" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <input type="text" name="description" className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
              {loading ? 'Processing...' : 'Create Product'}
            </button>
          </form>
        </div>

        {/* Price Form */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Price</h2>
          <form onSubmit={createPrice} className="space-y-4">
            <div>
              <label className="block mb-1">Amount (in cents)</label>
              <input type="number" name="amount" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1">Currency</label>
              <input type="text" name="currency" defaultValue="usd" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1">Product ID</label>
              <input type="text" name="product" className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
              {loading ? 'Processing...' : 'Create Price'}
            </button>
          </form>
        </div>

        {/* Checkout Session Form */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create Checkout Session</h2>
          <form onSubmit={createCheckoutSession} className="space-y-4">
            <div>
              <label className="block mb-1">Price ID</label>
              <input type="text" name="price" className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1">Quantity</label>
              <input type="number" name="quantity" defaultValue="1" className="w-full p-2 border rounded" required />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
              {loading ? 'Processing...' : 'Create Checkout Session'}
            </button>
          </form>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Result:</h3>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
