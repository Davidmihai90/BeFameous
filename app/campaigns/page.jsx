'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import CampaignCard from '@/components/CampaignCard';
import Image from 'next/image';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCampaigns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Eroare la încărcarea campaniilor:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Titlu */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Campanii Active
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Descoperă cele mai noi campanii create de brandurile de pe BeFameous.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-gray-400 text-lg">
              Se încarcă campaniile...
            </div>
          </div>
        )}

        {/* Fără campanii */}
        {!loading && campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              src="/no-campaigns.svg"
              alt="Nicio campanie"
              width={160}
              height={160}
              className="opacity-60 mb-4"
            />
            <p className="text-gray-400 text-center text-lg">
              Momentan nu există campanii active.<br />
              Revino mai târziu pentru a descoperi noi oportunități!
            </p>
          </div>
        )}

        {/* Grid campanii */}
        {!loading && campaigns.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-purple-600/50 hover:shadow-[0_0_20px_rgba(155,90,255,0.2)] transition-all duration-300"
              >
                <CampaignCard c={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
