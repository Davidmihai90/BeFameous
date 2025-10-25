'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy import pentru componente secundare (performanță)
const InfluencerDetails = dynamic(() => import('./InfluencerDetails'), { ssr: false });
const InfluencerInstagram = dynamic(() => import('./InfluencerInstagram'), { ssr: false });
const InfluencerFacebook = dynamic(() => import('./InfluencerFacebook'), { ssr: false });
const InfluencerTiktok = dynamic(() => import('./InfluencerTiktok'), { ssr: false });
const InfluencerAltele = dynamic(() => import('./InfluencerAltele'), { ssr: false });
const InfluencerPortofoliu = dynamic(() => import('./InfluencerPortofoliu'), { ssr: false });
const InfluencerFAQ = dynamic(() => import('./InfluencerFAQ'), { ssr: false });

function InfluencerDashboard() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState('detalii');

  useEffect(() => {
    // Scroll top pentru UX mai bun când schimbi tabul
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white/70 animate-pulse">
        Se încarcă sesiunea...
      </div>
    );

  if (!user) {
    redirect('/login');
    return null;
  }

  if (profile?.role !== 'influencer')
    return (
      <div className="p-6 text-white/70 min-h-screen bg-black flex items-center justify-center">
        Acces permis doar pentru conturile de tip Influencer.
      </div>
    );

  const tabs = [
    { key: 'detalii', label: 'Detalii Influencer' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'altele', label: 'Altele' },
    { key: 'portofoliu', label: 'Portofoliu' },
    { key: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-black text-white">
      <h1 className="text-2xl font-bold mb-6">Dashboard Influencer</h1>

      {/* Bara de taburi + butoane */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key
                  ? 'bg-purple-700 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {profile?.slug && (
            <Link
              href={`/influencer/${profile.slug}`}
              target="_blank"
              className="px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg text-sm font-medium transition"
            >
              Vezi profil public
            </Link>
          )}
          <Link
            href="/messages"
            className="px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg text-sm font-medium transition"
          >
            💬 Mesaje
          </Link>
        </div>
      </div>

      {/* Conținut taburi */}
      <div className="space-y-6 transition-opacity duration-300">
        {tab === 'detalii' && <InfluencerDetails />}
        {tab === 'instagram' && <InfluencerInstagram />}
        {tab === 'facebook' && <InfluencerFacebook />}
        {tab === 'tiktok' && <InfluencerTiktok />}
        {tab === 'altele' && <InfluencerAltele />}
        {tab === 'portofoliu' && <InfluencerPortofoliu />}
        {tab === 'faq' && <InfluencerFAQ />}
      </div>
    </div>
  );
}

export default memo(InfluencerDashboard);
