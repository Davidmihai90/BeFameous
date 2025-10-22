'use client';

import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function InfluencerDashboard() {
  const { user, profile, loading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'campaigns'));
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  if (loading) return <div className="p-10 text-gray-400">Se încarcă...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'influencer') {
    return <div className="p-10 text-gray-400">Acces permis doar pentru Influenceri.</div>;
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Influencer</h1>
      <h2 className="text-xl font-semibold">Campanii disponibile</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.length === 0 ? (
          <p className="text-gray-400">Nu există campanii disponibile momentan.</p>
        ) : (
          campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-purple-500/50 transition"
            >
              <h3 className="font-bold text-lg mb-2">{c.title}</h3>
              <p className="text-gray-400 text-sm">{c.description}</p>
              <p className="text-purple-400 mt-2 text-sm">Buget: €{c.budget}</p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 transition">
                Aplică
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
