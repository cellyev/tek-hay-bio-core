/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: {
    template: '%s | Tek Hay Bio',
    default: 'Klenteng Tek Hay Bio | Semarang',
  },
  description: 'Situs resmi Klenteng Tek Hay Bio, Semarang. Pusat informasi budaya, sejarah, dan kegiatan ritual.',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  )
}
