'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import CampaignCard from '@/components/CampaignCard';

export default function BrandCampaigns() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, 'campaigns'), where('owner', '==', user.uid));
    const snap = await getDocs(q);
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  if (loading) return <div className="text-white/70">Se încarcă...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Campaniile mele</h2>
      {list.length === 0 ? (
        <div className="text-white/60">Nu ai campanii create încă.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => (
            <CampaignCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
