import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import LayoutClient from '@/components/LayoutClient';

// 🟣 Metadata SEO + favicon
export const metadata = {
  title: 'BeFameous',
  description: 'Platformă de conectare influenceri și branduri',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// 🟣 Viewport config (Next.js 14+)
export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <LayoutClient>{children}</LayoutClient>
        {/* 🔍 Analytics + Performance */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
