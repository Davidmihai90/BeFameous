'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

export default function BrandAddCampaign() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', budget: '', brandName: '' });
  const [saving, setSaving] = useState(false);

  const create = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'campaigns'), {
        owner: user.uid,
        brandName: form.brandName || profile?.displayName || 'Brand',
        title: form.title,
        description: form.description,
        budget: Number(form.budget) || null,
        createdAt: serverTimestamp(),
        status: 'open',
      });
      setForm({ title: '', description: '', budget: '', brandName: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={create} className="card bg-white/5 border border-white/10 rounded-2xl p-6 grid md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-2">Adaugă campanie</h2>
      </div>

      <input
        className="px-3 py-2 rounded-lg bg-black/40 border border-white/15"
        placeholder="Nume brand"
        value={form.brandName}
        onChange={(e) => setForm({ ...form, brandName: e.target.value })}
      />
      <input
        className="px-3 py-2 rounded-lg bg-black/40 border border-white/15"
        placeholder="Titlu campanie"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        className="px-3 py-2 rounded-lg bg-black/40 border border-white/15"
        placeholder="Buget (€)"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      />
      <textarea
        className="md:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/15"
        rows={4}
        placeholder="Descriere"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button
        className="btn-primary md:col-span-2 bg-fuchsia-700 hover:bg-fuchsia-800 px-5 py-2 rounded-lg disabled:opacity-50"
        type="submit"
        disabled={saving}
      >
        {saving ? 'Se creează...' : 'Creează campanie'}
      </button>
    </form>
  );
}
