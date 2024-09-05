import "../styles/globals.css"
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'OAuth application',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-Br">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" sizes="64x64"/>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
