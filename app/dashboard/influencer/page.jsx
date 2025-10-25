'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Importăm componentele pentru fiecare tab
import InfluencerDetails from './InfluencerDetails';
import InfluencerInstagram from './InfluencerInstagram';
import InfluencerFacebook from './InfluencerFacebook';
import InfluencerTiktok from './InfluencerTiktok';
import InfluencerAltele from './InfluencerAltele';
import InfluencerPortofoliu from './InfluencerPortofoliu';
import InfluencerFAQ from './InfluencerFAQ';

export default function InfluencerDashboard() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState('detalii');

  if (loading) return <div className="p-6 text-white/70">Se încarcă sesiunea...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'influencer') {
    return <div className="p-6 text-white/70">Acces permis doar pentru conturile de tip Influencer.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Influencer</h1>

      {/* 🔹 Bara taburi + butoane Vezi profil public & Mesaje */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6">
        {/* TABURI */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'detalii', label: 'Detalii Influencer' },
            { key: 'instagram', label: 'Instagram' },
            { key: 'facebook', label: 'Facebook' },
            { key: 'tiktok', label: 'TikTok' },
            { key: 'altele', label: 'Altele' },
            { key: 'portofoliu', label: 'Portofoliu' },
            { key: 'faq', label: 'FAQ' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-4 py-2 rounded-lg transition text-sm font-medium',
                tab === t.key
                  ? 'bg-fuchsia-700 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* BUTOANE: vezi profil + mesaje */}
        <div className="flex items-center gap-3 mt-3 md:mt-0">
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

      {/* 🔹 Conținut taburi */}
      <div className="space-y-6">
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
