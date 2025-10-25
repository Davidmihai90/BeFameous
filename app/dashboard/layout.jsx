'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

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

  // 🔹 fără bara de sus și fără footer — doar conținutul efectiv al dashboardului
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto w-full p-6">{children}</main>
    </div>
  );
}
