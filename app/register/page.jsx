'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('influencer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createSlug = (name) =>
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .slice(0, 40);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Verifică dacă emailul există deja
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError('Există deja un cont asociat acestui email.');
        setLoading(false);
        return;
      }

      // Creează utilizatorul
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      // Creează document Firestore
      const slug = createSlug(displayName);
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        slug,
        publicProfile: true,
        createdAt: serverTimestamp(),
        photoURL: user.photoURL || '',
        category: '',
        description: '',
        location: '',
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      router.push(role === 'brand' ? '/dashboard/brand' : '/dashboard/influencer');
    } catch (err) {
      console.error('Eroare înregistrare:', err);
      if (err.code === 'auth/invalid-email') setError('Email invalid.');
      else if (err.code === 'auth/weak-password') setError('Parola este prea scurtă (minim 6 caractere).');
      else setError(err.message || 'A apărut o eroare la înregistrare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="BeFameous"
            width={160}
            height={90}
            priority
            loading="eager"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Creează un cont</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nume și prenume"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/50 border border-white/15 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/50 border border-white/15 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/50 border border-white/15 focus:outline-none focus:border-purple-500"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Tip cont:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/50 border border-white/15 text-gray-200 focus:outline-none focus:border-purple-500"
            >
              <option value="influencer">Influencer</option>
              <option value="brand">Brand</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? 'bg-purple-900 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105'
            }`}
          >
            {loading ? 'Se creează...' : 'Creează cont'}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Ai deja cont?{' '}
          <Link
            href="/login"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Autentifică-te
          </Link>
        </p>
      </div>
    </div>
  );
}
