'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    role: 'influencer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Creăm userul în Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // ✅ Actualizăm profilul (nume afisat)
      await updateProfile(user, { displayName: form.displayName });

      // ✅ Salvăm datele în Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: form.displayName,
        email: form.email,
        role: form.role,
        createdAt: new Date().toISOString()
      });

      // 🔁 Redirect automat în funcție de rol
      switch (form.role) {
        case 'brand':
          router.push('/dashboard/brand');
          break;
        case 'influencer':
          router.push('/dashboard/influencer');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/');
          break;
      }
    } catch (err) {
      console.error(err);
      setError('Eroare la înregistrare. Verifică datele introduse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Înregistrare</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Nume complet</label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              required
              className="w-full bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Parolă</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Tip cont</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="influencer">Influencer</option>
              <option value="brand">Brand</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {loading ? 'Se înregistrează...' : 'Creează cont'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Ai deja cont?{' '}
          <Link href="/login" className="text-purple-400 hover:underline">
            Autentifică-te
          </Link>
        </p>
      </div>
    </div>
  );
}
