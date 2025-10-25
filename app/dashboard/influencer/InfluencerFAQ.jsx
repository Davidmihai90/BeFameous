'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function InfluencerFAQ() {
  const { user, profile } = useAuth();

  const [previousBrands, setPreviousBrands] = useState(profile?.faq?.previousBrands || '');
  const [faqItems, setFaqItems] = useState(
    profile?.faq?.items || [{ q: 'Cu ce branduri ai lucrat?', a: '' }]
  );
  const [saving, setSaving] = useState(false);

  const addItem = () => setFaqItems([...faqItems, { q: '', a: '' }]);
  const removeItem = (i) => setFaqItems(faqItems.filter((_, idx) => idx !== i));

  const updateItem = (i, key, val) => {
    const next = [...faqItems];
    next[i][key] = val;
    setFaqItems(next);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        faq: { previousBrands, items: faqItems },
      });
      alert('FAQ salvat.');
    } catch (err) {
      console.error(err);
      alert('Eroare la salvare.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">FAQ & colaborări trecute</h2>

      <div className="grid gap-4">
        <textarea
          rows={3}
          placeholder="Cu ce branduri ai lucrat (scurtă listă/separați prin virgulă)…"
          value={previousBrands}
          onChange={(e) => setPreviousBrands(e.target.value)}
          className="bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3"
        />

        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <div key={i} className="border border-white/10 rounded-xl p-4">
              <input
                placeholder="Întrebare"
                value={item.q}
                onChange={(e) => updateItem(i, 'q', e.target.value)}
                className="w-full bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3 mb-2"
              />
              <textarea
                placeholder="Răspuns"
                rows={3}
                value={item.a}
                onChange={(e) => updateItem(i, 'a', e.target.value)}
                className="w-full bg-black/40 border border-white/15 text-white rounded-lg px-4 py-3"
              />
              <div className="mt-2 text-right">
                <button
                  onClick={() => removeItem(i)}
                  className="px-3 py-2 text-sm bg-white/10 hover:bg-white/15 rounded-lg"
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={addItem} className="px-5 py-3 bg-white/10 hover:bg-white/15 rounded-lg">
            + Adaugă întrebare
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
    </div>
  );
}
