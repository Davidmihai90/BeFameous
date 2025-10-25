'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

// 🔹 funcție pentru generare slug automat
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('influencer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });

      // 🔹 Generare slug automat
      const slug =
        slugify(displayName || email.split('@')[0]) + '-' + user.uid.slice(0, 5);

      // 🔹 Salvare în Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        role,
        displayName,
        email: user.email,
        createdAt: new Date(),
        slug,
      });

      // 🔹 Redirecționare în funcție de rol
      if (role === 'brand') router.push('/dashboard/brand');
      else if (role === 'influencer') router.push('/dashboard/influencer');
      else router.push('/');

    } catch (err) {
      console.error('Eroare la înregistrare:', err);
      setError('A apărut o eroare la înregistrare. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Creează un cont nou
        </h1>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Nume complet"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 bg-black/40 border border-white/15 text-white rounded-lg focus:outline-none focus:border-purple-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 bg-black/40 border border-white/15 text-white rounded-lg focus:outline-none focus:border-purple-500"
        />

        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 bg-black/40 border border-white/15 text-white rounded-lg focus:outline-none focus:border-purple-500"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 px-4 py-3 bg-black/40 border border-white/15 text-white rounded-lg focus:outline-none focus:border-purple-500"
        >
          <option value="influencer">Influencer</option>
          <option value="brand">Brand</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          {loading ? 'Se creează contul...' : 'Creează cont'}
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Ai deja cont?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 underline">
            Autentifică-te aici
          </Link>
        </p>
      </form>
    </div>
  );
}
