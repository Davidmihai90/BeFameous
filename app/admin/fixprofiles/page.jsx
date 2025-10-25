'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function FixProfiles() {
  const { user, profile, loading } = useAuth();
  const [log, setLog] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user || profile?.role !== 'admin') {
      setLog(['⛔ Acces interzis — doar adminii pot folosi această pagină.']);
      return;
    }

    const fixProfiles = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const updates = [];

        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          if ((data.role === 'brand' || data.role === 'influencer') && data.publicProfile !== true) {
            await updateDoc(doc(db, 'users', docSnap.id), { publicProfile: true });
            updates.push(`✔️ ${data.displayName || data.email} actualizat.`);
          }
        }

        if (updates.length === 0) {
          setLog(['✅ Toate profilurile sunt deja publice.']);
        } else {
          setLog(updates);
        }
      } catch (err) {
        console.error('Eroare la actualizare:', err);
        setLog([`❌ Eroare: ${err.message}`]);
      }
    };

    fixProfiles();
  }, [loading, user, profile]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-6">🔧 Fix Public Profiles</h1>
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        {log.length === 0 ? (
          <p>Procesare în curs...</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-300">
            {log.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
