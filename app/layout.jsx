import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';

// 🧠 Meta SEO standard
export const metadata = {
  title: 'BeFameous',
  description: 'Platformă de conectare influenceri și branduri',
  charset: 'utf-8',
};

// 📱 Viewport modern (mutat separat)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

// 🧱 Layout general aplicabil tuturor paginilor
export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* Provider pentru autentificare globală */}
        <AuthProvider>
          {/* Bara de navigare globală */}
          <Navbar />

          {/* Conținutul principal */}
          <main className="flex-grow">{children}</main>

          {/* Footer global */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
