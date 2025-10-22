'use client';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import CampaignCard from '@/components/CampaignCard';

export default function InfluencerDashboard() {
  const { user, profile, loading } = useAuth();
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [appliedCampaigns, setAppliedCampaigns] = useState([]);

  // 🔹 Citim campaniile în timp real
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'campaigns'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllCampaigns(data);

      // Filtrăm doar campaniile la care acest influencer a aplicat
      const mine = data.filter((c) =>
        (c.applications || []).some((a) => a.uid === user.uid)
      );
      setAppliedCampaigns(mine);
    });

    return () => unsub();
  }, [user]);

  // 🔒 Protecție acces
  if (loading)
    return <div className="text-white/70 p-8">Se încarcă sesiunea...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'influencer')
    return (
      <div className="text-white/70 p-8">
        Acces permis doar influencerilor.
      </div>
    );

  // 🔹 Render UI
  return (
    <div className="container-p py-8 space-y-10">
      <h1 className="text-2xl font-bold text-white mb-8">
        Dashboard Influencer
      </h1>

      {/* ✅ Campaniile la care ai aplicat */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">
          Campaniile la care ai aplicat
        </h2>

        {appliedCampaigns.length === 0 && (
          <p className="text-white/70">
            Nu ai aplicat încă la nicio campanie.
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appliedCampaigns.map((c) => (
            <CampaignCard key={c.id} c={c} showApplyButton={false} />
          ))}
        </div>
      </section>

      <hr className="border-white/10" />

      {/* 🟣 Toate campaniile disponibile */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">
          Toate campaniile disponibile
        </h2>

        {allCampaigns.length === 0 && (
          <p className="text-white/70">
            Momentan nu există campanii active.
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCampaigns.map((c) => (
            <CampaignCard key={c.id} c={c} showApplyButton={true} />
          ))}
        </div>
      </section>
    </div>
  );
}
