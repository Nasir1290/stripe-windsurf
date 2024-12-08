'use client';

import Link from 'next/link';

export default function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
        <Link href="/" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
