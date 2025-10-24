'use client';

import { useEffect, useState } from 'react';
import AuthProvider, { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutClient({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}

function LayoutContent({ children }) {
  const { user, profile } = useAuth();
  const [showToast, setShowToast] = useState(false);

  // 🔔 Afișează toast la login
  useEffect(() => {
    if (user && profile && !showToast) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [user, profile]);

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />

      {/* 💜 Toast de bun venit */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-purple-700/90 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fadeInUp z-[9999]">
          💜 Bine ai revenit, {profile?.displayName || 'în BeFameous'}!
        </div>
      )}

      {/* 🔥 Mică animație CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
