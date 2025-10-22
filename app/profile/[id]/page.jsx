'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfilePage({ params }) {
  const { id } = params;
  const [p, setP] = useState(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'users', id));
      setP(snap.exists() ? snap.data() : null);
    };
    load();
  }, [id]);

  if (!p) return <div className="text-white/70">Profilul nu a fost găsit.</div>;

  return (
    <div className="max-w-xl mx-auto card p-6">
      <div className="flex items-center gap-4">
        <img src={p.photoURL || '/avatar.png'} alt="avatar" className="h-16 w-16 rounded-full border border-white/10"/>
        <div>
          <h1 className="text-2xl font-bold">{p.displayName || 'Utilizator'}</h1>
          <div className="text-sm text-white/60">{p.role || '—'}</div>
          <div className="text-sm text-white/60">{p.email || '—'}</div>
        </div>
      </div>
      {p.bio && <p className="mt-4 text-white/80">{p.bio}</p>}
    </div>
  );
}
