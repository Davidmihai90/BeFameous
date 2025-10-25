'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function InfluencerDetails() {
  const { user, profile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName?.trim() || null,
        location: location?.trim() || null,
        bio: bio?.trim() || null,
      });
      alert('Detaliile au fost salvate cu succes!');
    } catch (err) {
      console.error(err);
      alert('A apărut o eroare la salvare.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Detalii Influencer</h2>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Nume și prenume"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-fuchsia-500"
        />

        <input
          type="text"
          placeholder="Locație (ex: București)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-fuchsia-500"
        />

        <textarea
          placeholder="Descriere scurtă despre tine (ce faci, cu ce te diferențiezi)…"
          rows={5}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-fuchsia-500"
        />

        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Se salvează…' : '💾 Salvează'}
          </button>
        </div>
      </div>
    </div>
  );
}
