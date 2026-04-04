import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'MoneyFlow',
  description: 'Controle financeiro',
  icons: {
    icon: '/icon-logo.svg',
  },
}
 
const inter = Inter({
  subsets: ['latin'],
    weight: ['400', '700'], 
  variable: '--font-inter', // Useful for Tailwind
  display: 'swap',
});
 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}</body>
    </html>
  )
}