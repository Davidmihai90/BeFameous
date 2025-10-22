'use client';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  // 🔁 Dacă e deja logat, redirecționează automat
  useEffect(() => {
    if (loading) return;
    if (user && profile?.role) {
      if (profile.role === 'influencer') router.replace('/dashboard/influencer');
      else if (profile.role === 'brand') router.replace('/dashboard/brand');
      else router.replace('/');
    }
  }, [user, profile, loading, router]);

  // 🔹 Funcția de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingLogin(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'influencer') router.push('/dashboard/influencer');
        else if (userData.role === 'brand') router.push('/dashboard/brand');
        else router.push('/');
      } else {
        setError('Profilul utilizatorului nu există în baza de date.');
      }
    } catch (err) {
      console.error(err);
      setError('Email sau parolă incorecte.');
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gradient-to-b from-[#111] to-[#0b0b0b] p-8 rounded-2xl border border-white/10 shadow-lg w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Autentificare</h1>

        {error && (
          <p className="text-red-400 text-center bg-red-950/30 border border-red-700/30 py-2 rounded-md">
            {error}
          </p>
        )}

        <div>
          <label className="block mb-2 text-sm text-gray-300">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-[#a855f7] outline-none"
            placeholder="exemplu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-300">Parolă</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-[#a855f7] outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loadingLogin}
          style={{
            background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
            boxShadow: '0 0 12px rgba(168,85,247,0.6)',
            border: 'none',
          }}
          className="w-full py-3 rounded-lg text-white font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loadingLogin ? 'Se autentifică...' : 'Autentifică-te'}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Nu ai cont?{' '}
          <a href="/register" className="text-[#a855f7] hover:underline">
            Creează unul acum
          </a>
        </p>
      </form>
    </div>
  );
}
