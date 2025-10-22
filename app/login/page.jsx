'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError('Profilul utilizatorului nu există.');
        setLoading(false);
        return;
      }

      const role = snap.data().role;

      // 🔁 Redirecționează automat după rol
      switch (role) {
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
      setError('Email sau parolă incorecte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Autentificare</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Parolă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/15 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {loading ? 'Se conectează...' : 'Autentifică-te'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Nu ai cont?{' '}
          <Link href="/register" className="text-purple-400 hover:underline">
            Creează unul
          </Link>
        </p>
      </div>
    </div>
  );
}
