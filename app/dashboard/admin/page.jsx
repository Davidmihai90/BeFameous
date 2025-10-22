'use client';

import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  if (loading) return <div className="p-10 text-gray-400">Se încarcă...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'admin') {
    return <div className="p-10 text-gray-400">Acces permis doar administratorilor.</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <p className="text-gray-400 mb-6">Ai acces complet la utilizatori și campanii.</p>

      <h2 className="text-xl font-semibold mb-3">Utilizatori înregistrați</h2>
      <table className="w-full border border-white/10 text-sm text-left">
        <thead className="bg-white/10">
          <tr>
            <th className="p-3">Nume</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
              <td className="p-3">{u.displayName || '—'}</td>
              <td className="p-3">{u.email || '—'}</td>
              <td className="p-3 capitalize">{u.role || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
