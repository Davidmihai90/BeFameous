'use client';

import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export default function BrandDashboard() {
  const { user, profile, loading } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', budget: '', brandName: '' });
  const [list, setList] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const q = query(collection(db, 'campaigns'), where('owner', '==', user.uid));
      const snap = await getDocs(q);
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [user]);

  const create = async (e) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, 'campaigns'), {
      owner: user.uid,
      brandName: form.brandName || profile?.displayName || 'Brand',
      title: form.title,
      description: form.description,
      budget: Number(form.budget) || null,
      createdAt: serverTimestamp(),
      status: 'open'
    });
    setForm({ title: '', description: '', budget: '', brandName: '' });
    const q = query(collection(db, 'campaigns'), where('owner', '==', user.uid));
    const snap = await getDocs(q);
    setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  if (loading) return <div className="p-10 text-gray-400">Se încarcă sesiunea...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'brand') {
    return <div className="p-10 text-gray-400">Acces permis doar pentru Branduri.</div>;
  }

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard Brand</h1>

      <form onSubmit={create} className="bg-white/10 border border-white/10 rounded-xl p-6 grid gap-4 md:grid-cols-2">
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10"
          placeholder="Nume Brand"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10"
          placeholder="Titlu Campanie"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-lg bg-black/40 border border-white/10"
          placeholder="Buget (€)"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <textarea
          className="md:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10"
          rows={4}
          placeholder="Descriere Campanie"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="md:col-span-2 px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 font-semibold">
          Creează Campanie
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Campaniile tale</h2>
        {list.length === 0 ? (
          <p className="text-gray-400">Nu ai încă nicio campanie.</p>
        ) : (
          <ul className="space-y-3">
            {list.map(c => (
              <li key={c.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="font-semibold">{c.title}</p>
                <p className="text-gray-400 text-sm">{c.description}</p>
                <p className="text-purple-400 text-sm mt-1">Buget: €{c.budget}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
