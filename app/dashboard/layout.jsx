'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const { user, loading, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const validRoles = ['brand', 'influencer', 'admin'];
    if (profile && !validRoles.includes(profile.role)) {
      router.push('/');
    }
  }, [user, loading, profile, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Se verifică sesiunea...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* 🔹 Bara de sus Dashboard */}
      <header className="bg-white/5 border-b border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Stânga: Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/logo.svg" alt="BeFameous" className="h-8" />
            <span className="font-semibold text-lg text-white">Dashboard</span>
          </Link>

          {/* Dreapta: Utilizator + Logout */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col text-right">
              <span className="font-medium">{profile?.displayName || user?.email}</span>
              <span className="text-xs text-gray-400 capitalize">{profile?.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* 🔹 Conținut principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">{children}</main>

      {/* 🔹 Footer mic */}
      <footer className="border-t border-white/10 py-4 text-center text-sm text-white/50">
        © {new Date().getFullYear()} BeFameous — Conectăm branduri și influenceri.
      </footer>
    </div>
  );
}
