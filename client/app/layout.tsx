import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Backoffice Deliveroo - Dokaa',
  description: 'Test technique pour Dokaa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

