'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { SpeedInsights } from '@vercel/speed-insights/next';
import FirebaseDebug from '@/components/FirebaseDebug';

export default function HomePage() {
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [topInfluencers, setTopInfluencers] = useState([]);
  const [newInfluencers, setNewInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Încarcă influencerii de top
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const influencers = data.filter((u) => u.role === 'influencer');

        const top = influencers
          .filter((u) => u.rating >= 4.5)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 9);

        const newest = [...influencers]
          .sort((a, b) => {
            const aDate = a.createdAt?.toMillis?.() || 0;
            const bDate = b.createdAt?.toMillis?.() || 0;
            return bDate - aDate;
          })
          .slice(0, 9);

        setTopInfluencers(top);
        setNewInfluencers(newest);
      } catch (err) {
        console.error('Eroare la încărcarea influencerilor:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = () => {
    console.log('Căutare după:', platform, category);
    // viitor redirect la /influencers?platform=...&category=...
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO — fără background image */}
      <section className="relative flex flex-col items-center justify-center text-center py-28 px-4 overflow-hidden bg-gradient-to-b from-black via-black/90 to-black">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Găsește Influenceri Rapid
        </h1>
        <p className="text-gray-300 max-w-2xl mb-10">
          Caută creatori reali, autentici și activi pe platformele preferate.
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

      {/* 🔹 INFLUENCERI NOI */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center text-purple-400">
          Influenceri Noi
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center">Se încarcă...</p>
        ) : newInfluencers.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {newInfluencers.map((inf) => (
              <div
                key={inf.id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={inf.photoURL || '/demo/influencer1.jpg'}
                    alt={inf.displayName || 'Influencer'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-bold text-lg">
                      {inf.displayName || 'Influencer'}
                    </h3>
                    <p className="text-sm text-gray-300 capitalize">
                      {inf.platform || 'Platformă necunoscută'}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      {inf.category || 'Categorie'}
                    </p>
                    <p className="font-semibold text-purple-400">
                      ⭐ {inf.rating || 'Nou'}
                    </p>
                  </div>
                  <a
                    href={`/influencer/${inf.slug || inf.id}`}
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition"
                  >
                    Vezi Profil
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">Nu există influenceri noi.</p>
        )}
      </section>

      {/* 🔹 INFLUENCERI DE TOP */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Influenceri de Top</h2>

        {loading ? (
          <p className="text-gray-400 text-center">Se încarcă...</p>
        ) : topInfluencers.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {topInfluencers.map((inf) => (
              <div
                key={inf.id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={inf.photoURL || '/demo/influencer1.jpg'}
                    alt={inf.displayName || 'Influencer'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-bold text-lg">
                      {inf.displayName || 'Influencer'}
                    </h3>
                    <p className="text-sm text-gray-300 capitalize">
                      {inf.platform || 'Platformă necunoscută'}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      {inf.category || 'Categorie'}
                    </p>
                    <p className="font-semibold text-purple-400">
                      ⭐ {inf.rating || '5.0'}
                    </p>
                  </div>
                  <a
                    href={`/influencer/${inf.slug || inf.id}`}
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition"
                  >
                    Vezi Profil
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">Nu există influenceri încă.</p>
        )}
      </section>

      {/* DEBUG FIREBASE */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <FirebaseDebug />
      </section>

      <SpeedInsights />
    </div>
  );
}
