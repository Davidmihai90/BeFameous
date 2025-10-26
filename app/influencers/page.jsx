'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'influencer'));
        const snap = await getDocs(q);
        setInfluencers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('❌ Eroare la încărcarea influencerilor:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = influencers.filter(
    (i) =>
      (i.displayName?.toLowerCase().includes(search.toLowerCase()) || search === '') &&
      (i.category?.toLowerCase().includes(category.toLowerCase()) || category === '') &&
      i.publicProfile !== false
  );

  return (
    <div className="min-h-screen text-white relative">
      {/* 🔮 BACKGROUND GRADIENT FIX — layer fix peste tot ecranul */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-black/90 to-black pointer-events-none" />

      {/* HERO / FILTRE */}
      <section className="py-20 px-6 text-center border-b border-white/10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Toți Influencerii
        </h1>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Descoperă creatori autentici, activi și verificați pe platformele tale preferate.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Caută după nume..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            placeholder="Categorie (ex: beauty, travel...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-white/10 border border-white/15 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </section>

      {/* LISTĂ DE INFLUENCERI */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <p className="text-gray-400 text-center">Se încarcă...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-center">Niciun influencer găsit.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((inf) => (
              <Link
                key={inf.id}
                href={`/influencer/${inf.slug || inf.id}`}
                className="group relative bg-white/10 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/60 hover:shadow-[0_0_25px_rgba(155,90,255,0.3)] transition-all duration-300"
              >
                {/* Imaginea */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={inf.photoURL || '/demo/influencer1.jpg'}
                    alt={inf.displayName || 'Influencer'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                  {/* Text peste imagine */}
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-bold text-lg">{inf.displayName || 'Influencer'}</h3>
                    <p className="text-sm text-gray-300">{inf.platform || 'Platformă necunoscută'}</p>
                  </div>
                </div>

                {/* Detalii sub card */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{inf.category || 'Categorie necunoscută'}</p>
                    <p className="text-purple-400 font-semibold text-sm">
                      ⭐ {inf.rating ? Number(inf.rating).toFixed(1) : 'Nou'}
                    </p>
                  </div>
                  <span className="text-sm font-medium px-4 py-2 rounded-lg bg-purple-700/80 hover:bg-purple-800 transition">
                    Vezi Profil
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
