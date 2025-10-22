import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'BeFameous',
  description: 'Platformă de conectare influenceri și branduri',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className="bg-black text-white">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
