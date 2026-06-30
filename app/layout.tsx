import './globals.css';
import { Orbitron, Rajdhani, Press_Start_2P, Share_Tech_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start-2p',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-share-tech-mono',
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
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${pressStart2P.variable} ${shareTechMono.variable}`}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
