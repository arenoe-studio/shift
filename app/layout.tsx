import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Poppins } from 'next/font/google'

import AppShell from '@/components/layout/AppShell'

import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const dmSans = DM_Sans({
  variable: '--font-dmsans',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'SHIFT+',
  description: 'SHIFT+ dashboard',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full font-dmsans bg-[#F8FAFC] text-slate-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
