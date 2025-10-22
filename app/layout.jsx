import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'BeFameous – Conectăm branduri și influenceri',
  description: 'Marketplace modern care conectează branduri și creatori. Next.js + Firebase.',
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro" className="dark">
      <body className="min-h-screen bg-hero text-white selection:bg-brand/40 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="container-p py-10">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
