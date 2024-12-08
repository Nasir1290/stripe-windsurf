import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stripe Client',
  description: 'A Next.js app to test Stripe API endpoints',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
