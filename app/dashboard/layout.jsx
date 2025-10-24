'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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

  if (loading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Se verifică sesiunea...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔹 Conținutul real al dashboardului */}
      <main className="max-w-7xl mx-auto w-full p-6">{children}</main>
    </div>
  );
}
