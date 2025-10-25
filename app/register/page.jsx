'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDocs, query, where, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
      // ✅ 1️⃣ Verifică dacă emailul există deja
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError('Există deja un cont asociat acestui email.');
        setLoading(false);
        return;
      }

      // ✅ 2️⃣ Creează utilizatorul
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      // ✅ 3️⃣ Creează document Firestore
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

      alert('Cont creat cu succes!');
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full bg-white/5 p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold mb-6 text-center">Creează un cont</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nume și prenume"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 placeholder-white/50 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 placeholder-white/50 focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 placeholder-white/50 focus:outline-none focus:border-purple-500"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">Tip cont:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-gray-200 focus:outline-none focus:border-purple-500"
            >
              <option value="influencer">Influencer</option>
              <option value="brand">Brand</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {loading ? 'Se creează...' : 'Creează cont'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
