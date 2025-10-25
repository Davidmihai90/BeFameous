'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';

import BrandDetails from './BrandDetails';
import BrandSocials from './BrandSocials';
import BrandImages from './BrandImages';
import BrandAddCampaign from './BrandAddCampaign';
import BrandCampaigns from './BrandCampaigns';
import Link from 'next/link';

const TABS = [
  { key: 'details', label: 'Detalii Brand' },
  { key: 'socials', label: 'Social Media' },
  { key: 'images', label: 'Imagini' },
  { key: 'add', label: 'Adaugă Campanie' },
  { key: 'mine', label: 'Campaniile mele' },
];

export default function BrandDashboard() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState('details');

  if (loading) return <div className="p-6 text-white/70">Se încarcă sesiunea...</div>;
  if (!user) { redirect('/login'); return null; }
  if (profile?.role !== 'brand') return <div className="p-6 text-white/70">Acces permis doar pentru conturile de tip Brand.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Brand</h1>

      {/* 🔹 Bara taburi + Vezi profil + Mesaje */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-4 py-2 rounded-lg transition text-sm font-medium',
                tab === t.key
                  ? 'bg-fuchsia-700 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {profile?.slug && (
            <Link
              href={`/brand/${profile.slug}`}
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
      <div className="space-y-6">
        {tab === 'details' && <BrandDetails />}
        {tab === 'socials' && <BrandSocials />}
        {tab === 'images' && <BrandImages />}
        {tab === 'add' && <BrandAddCampaign />}
        {tab === 'mine' && <BrandCampaigns />}
      </div>
    </div>
  );
}
