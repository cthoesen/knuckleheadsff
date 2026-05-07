import './globals.css';
import { Orbitron, Rajdhani } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

export const metadata = {
  title: 'Knuckleheads Fantasy Football',
  description: 'Custom CSS, JavaScript, and assets for Knuckleheads Fantasy Football leagues',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="bg-zinc-950 text-zinc-100">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
