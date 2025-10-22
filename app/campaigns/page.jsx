'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import CampaignCard from '@/components/CampaignCard';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setCampaigns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="container-p py-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Campanii active</h1>

      {campaigns.length === 0 && (
        <p className="text-white/70">Momentan nu există campanii active.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
