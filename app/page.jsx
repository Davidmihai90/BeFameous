'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function HomePage() {
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [newInfluencers, setNewInfluencers] = useState([]);
  const [newBrands, setNewBrands] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const influencers = all.filter(
          (u) => u.role === 'influencer' && u.publicProfile !== false
        );
        const brands = all.filter(
          (u) => u.role === 'brand' && u.publicProfile !== false
        );

        const newestInfluencers = [...influencers]
          .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
          .slice(0, 9);

        const topRatedInfluencers = [...influencers]
          .filter((u) => (u.rating ?? 0) >= 4.5)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 9);

        const newestBrands = [...brands]
          .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
          .slice(0, 9);

        const topRatedBrands = [...brands]
          .sort(
            (a, b) =>
              (b.totalCampaigns ?? b.rating ?? 0) -
              (a.totalCampaigns ?? a.rating ?? 0)
          )
          .slice(0, 9);

        setNewInfluencers(newestInfluencers);
        setTopInfluencers(topRatedInfluencers);
        setNewBrands(newestBrands);
        setTopBrands(topRatedBrands);
      } catch (err) {
        console.error('❌ Eroare la încărcarea datelor:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = () => {
    console.log('Căutare după:', platform, category);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO fără imagine */}
      <section className="relative flex flex-col items-center justify-center text-center py-28 px-4 overflow-hidden bg-gradient-to-b from-black via-black/90 to-black">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Găsește Influenceri și Branduri Rapid
        </h1>
        <p className="text-gray-300 max-w-2xl mb-10">
          Caută creatori reali, branduri de încredere și campanii active.
        </p>

        <div className="w-full max-w-3xl bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="flex-1 bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
          >
            <option value="">Platformă</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="ugc">UGC</option>
          </select>

          <input
            type="text"
            placeholder="Categorie (ex: beauty, fashion, fitness...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-3 placeholder-white/40 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Caută
          </button>
        </div>
      </section>

      <Section title="Influenceri Noi" color="text-purple-400" loading={loading} data={newInfluencers} type="influencer" />
      <Section title="Influenceri de Top" color="text-amber-400" loading={loading} data={topInfluencers} type="influencer" top />
      <Section title="Branduri Noi" color="text-pink-400" loading={loading} data={newBrands} type="brand" />
      <Section title="Branduri de Top" color="text-fuchsia-400" loading={loading} data={topBrands} type="brand" top />

      <SpeedInsights />
    </div>
  );
}

/* 🔸 Componentă generală pentru secțiuni */
function Section({ title, color, loading, data, type, top = false }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className={`text-3xl font-bold mb-10 text-center ${color}`}>{title}</h2>
      {loading ? (
        <p className="text-gray-400 text-center">Se încarcă...</p>
      ) : data.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) =>
            type === 'influencer' ? (
              <InfluencerCard key={item.id} data={item} />
            ) : (
              <BrandCard key={item.id} data={item} top={top} />
            )
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-center">Momentan nu există date disponibile.</p>
      )}
    </section>
  );
}

/* 🔸 Card Influencer */
function InfluencerCard({ data }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={data.photoURL || '/demo/influencer1.jpg'}
          alt={data.displayName || 'Influencer'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-bold text-lg">{data.displayName || 'Influencer'}</h3>
          <p className="text-sm text-gray-300 capitalize">{data.platform || 'Platformă necunoscută'}</p>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{data.category || 'Categorie'}</p>
          <p className="font-semibold text-purple-400">⭐ {data.rating || 'Nou'}</p>
        </div>
        <a
          href={`/influencer/${data.slug || data.id}`}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition"
        >
          Vezi Profil
        </a>
      </div>
    </div>
  );
}

/* 🔸 Card Brand */
function BrandCard({ data, top = false }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 transition">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={data.logoURL || '/demo/brand1.jpg'}
          alt={data.displayName || 'Brand'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="font-bold text-lg">{data.displayName || 'Brand'}</h3>
          <p className="text-sm text-gray-300 capitalize">{data.category || 'Categorie necunoscută'}</p>
          {top && data.totalCampaigns && (
            <p className="text-xs text-gray-400 mt-1">
              Campanii create: <span className="text-pink-400 font-semibold">{data.totalCampaigns}</span>
            </p>
          )}
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">{data.location || 'Locație necunoscută'}</p>
        <a
          href={`/brand/${data.slug || data.id}`}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-pink-700 hover:bg-pink-800 transition"
        >
          Vezi Profil
        </a>
      </div>
    </div>
  );
}
