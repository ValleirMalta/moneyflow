import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata = {
  title: {
    default: 'MoneyFlow',
    template: '%s | MoneyFlow',
  },
  description: 'Controle financeiro pessoal simples e eficiente',
  icons: {
    icon: '/icon-logo.svg',
  },
}
 
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-inter',
  display: 'swap',
});
 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}