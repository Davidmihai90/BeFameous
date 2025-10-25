'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function InfluencerFacebook() {
  const { user, profile } = useAuth();
  const [packs, setPacks] = useState(profile?.facebookPackages || []);
  const [saving, setSaving] = useState(false);

  const addPack = () => setPacks([...packs, { tip: '', pret: '', descriere: '' }]);
  const removePack = (i) => setPacks(packs.filter((_, idx) => idx !== i));
  const updateField = (i, key, val) => {
    const next = [...packs];
    next[i][key] = val;
    setPacks(next);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { facebookPackages: packs });
      alert('Pachetele Facebook au fost salvate!');
    } catch (err) {
      console.error(err);
      alert('Eroare la salvare.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-2">Facebook — pachete & prețuri</h2>
      <p className="text-white/60 mb-4 text-sm">
        Adaugă pachete pentru postări, video, live-uri, grupuri etc.
      </p>

      <div className="space-y-4">
        {packs.map((p, i) => (
          <div key={i} className="border border-white/10 rounded-xl p-4">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                placeholder="Tip pachet"
                value={p.tip}
                onChange={(e) => updateField(i, 'tip', e.target.value)}
                className="bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3"
              />
              <input
                placeholder="Preț"
                value={p.pret}
                onChange={(e) => updateField(i, 'pret', e.target.value)}
                className="bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3"
              />
            </div>
            <textarea
              placeholder="Descriere pachet"
              value={p.descriere}
              onChange={(e) => updateField(i, 'descriere', e.target.value)}
              className="mt-3 bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3 w-full"
              rows={3}
            />
            <div className="mt-3 text-right">
              <button
                onClick={() => removePack(i)}
                className="px-3 py-2 text-sm bg-white/10 hover:bg-white/15 rounded-lg"
              >
                Șterge
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-5">
        <button onClick={addPack} className="px-5 py-3 bg-white/10 hover:bg-white/15 rounded-lg">
          + Adaugă pachet
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'Se salvează…' : '💾 Salvează'}
        </button>
      </div>
    </div>
  );
}
