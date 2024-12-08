'use client';

import Link from 'next/link';

export default function Cancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">Your payment was cancelled. No charges were made.</p>
        <Link href="/" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
