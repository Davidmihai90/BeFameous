'use client';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'ugc'];
const AD_TYPES = [
  'Postare foto',
  'Story',
  'Video review',
  'Giveaway',
  'Testimonial',
  'Campanie sponsorizată'
];

export default function InfluencerDashboard() {
  const { user, profile, loading } = useAuth();
  const [platforms, setPlatforms] = useState([]);
  const [adTypes, setAdTypes] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.role === 'influencer') {
      setPlatforms(profile?.platforms || []);
      setAdTypes(profile?.adTypes || []);
    }
  }, [profile]);

  if (loading) return <div>Se încarcă...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'influencer') {
    return <div>Acces permis doar pentru influenceri.</div>;
  }

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    await updateDoc(doc(db, 'users', user.uid), {
      platforms,
      adTypes
    });
    setSaving(false);
    alert('Profilul a fost actualizat cu succes!');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profilul meu de Influencer</h1>

      <div className="space-y-4 bg-white/10 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold mb-2">Platforme active</h2>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => toggleItem(p, platforms, setPlatforms)}
              className={`px-4 py-2 rounded-lg border transition ${
                platforms.includes(p)
                  ? 'bg-purple-700 border-purple-400'
                  : 'bg-black/40 border-white/20 hover:border-purple-300'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 bg-white/10 rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold mb-2">Tipuri de reclame</h2>
        <div className="flex flex-wrap gap-2">
          {AD_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleItem(t, adTypes, setAdTypes)}
              className={`px-4 py-2 rounded-lg border transition ${
                adTypes.includes(t)
                  ? 'bg-purple-700 border-purple-400'
                  : 'bg-black/40 border-white/20 hover:border-purple-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={saveProfile}
        disabled={saving}
        className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-800 py-3 px-8 rounded-lg font-semibold hover:scale-105 transition-transform"
      >
        {saving ? 'Se salvează...' : 'Salvează modificările'}
      </button>
    </div>
  );
}
