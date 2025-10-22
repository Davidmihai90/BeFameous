'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Calendar, DollarSign, User, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetails() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [status, setStatus] = useState('');

  // 🔹 Citim campania din Firestore
  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, 'campaigns', id);
      const snap = await getDoc(ref);
      if (snap.exists()) setCampaign({ id: snap.id, ...snap.data() });
    };
    fetchData();
  }, [id]);

  // 🔹 Funcția de aplicare
  const apply = async () => {
    if (!user) return setStatus('Trebuie să te loghezi pentru a aplica.');

    const ref = doc(db, 'campaigns', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return setStatus('Campania nu mai există.');

    const data = snap.data();
    const applications = data.applications || [];
    const alreadyApplied = applications.some((a) => a.uid === user.uid);

    if (alreadyApplied) return setStatus('Ai aplicat deja la această campanie.');

    await updateDoc(ref, {
      applications: [
        ...applications,
        {
          uid: user.uid,
          name: profile?.displayName || user.email,
          createdAt: new Date().toISOString(),
        },
      ],
    });

    setStatus('Ai aplicat cu succes!');
    setTimeout(() => setStatus(''), 2500);
  };

  if (!campaign)
    return (
      <div className="container-p py-16 text-white/70 text-center">
        Se încarcă detaliile campaniei...
      </div>
    );

  return (
    <div className="container-p py-10 space-y-8">
      {/* Înapoi */}
      <Link
        href="/campaigns"
        className="text-white/60 hover:text-white transition flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Înapoi la campanii
      </Link>

      {/* Titlu + brand */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{campaign.title}</h1>
        <div className="flex items-center gap-2 text-white/70">
          <Building2 size={16} className="text-pink-400" />
          {campaign.brandName || 'Brand necunoscut'}
        </div>
      </div>

      {/* Detalii principale */}
      <div className="flex flex-wrap items-center gap-6 text-white/70">
        <div className="flex items-center gap-1">
          <DollarSign size={18} className="text-green-400" />
          Buget: <span className="ml-1 text-white">{campaign.budget || 'Nespecificat'} €</span>
        </div>
        {campaign.createdAt && (
          <div className="flex items-center gap-1">
            <Calendar size={18} className="text-blue-400" />
            Publicată:{' '}
            <span className="ml-1 text-white">
              {new Date(campaign.createdAt.seconds * 1000).toLocaleDateString('ro-RO')}
            </span>
          </div>
        )}
        {campaign.applications && (
          <div className="flex items-center gap-1">
            <User size={18} className="text-pink-400" />
            {campaign.applications.length} aplicați
          </div>
        )}
      </div>

      {/* Descriere */}
      <p className="text-white/80 leading-relaxed whitespace-pre-line">
        {campaign.description || 'Această campanie nu are descriere.'}
      </p>

      {/* Buton Aplică */}
      {profile?.role === 'influencer' && (
        <button
          onClick={apply}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-medium transition"
        >
          Aplică la această campanie
        </button>
      )}

      {status && (
        <div className="text-sm text-green-400 bg-white/10 px-3 py-2 rounded-lg w-fit">
          {status}
        </div>
      )}
    </div>
  );
}
