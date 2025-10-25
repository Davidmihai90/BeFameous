'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Email sau parolă incorectă.');
      console.error(err);
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

        <h1 className="text-2xl font-bold text-center mb-6">Autentificare</h1>

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? 'bg-purple-900 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105'
            }`}
          >
            {loading ? 'Se conectează...' : 'Conectează-te'}
          </button>

          {error && (
            <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Nu ai cont?{' '}
          <Link
            href="/register"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Creează cont
          </Link>
        </p>
      </div>
    </div>
  );
}
