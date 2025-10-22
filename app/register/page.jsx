'use client';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('influencer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user && profile?.role) {
      if (profile.role === 'influencer') router.replace('/dashboard/influencer');
      else if (profile.role === 'brand') router.replace('/dashboard/brand');
      else router.replace('/');
    }
  }, [user, profile, loading, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoadingRegister(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      setSuccess(true);

      setTimeout(async () => {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        const userData = userDoc.data();
        if (userData.role === 'influencer') router.push('/dashboard/influencer');
        else if (userData.role === 'brand') router.push('/dashboard/brand');
        else router.push('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Eroare la crearea contului: ' + err.message);
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* 🟢 Overlay de succes */}
      {success && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-green-500 mb-4" />
          <p className="text-green-400 text-lg font-medium">
            ✅ Cont creat cu succes
          </p>
          <p className="text-gray-300 text-sm mt-2">
            Redirecționare către dashboard...
          </p>
        </div>
      )}

      {/* Formularul */}
      <form
        onSubmit={handleRegister}
        className="bg-gradient-to-b from-[#111] to-[#0b0b0b] p-8 rounded-2xl border border-white/10 shadow-lg w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center mb-4">Creează un cont</h1>

        {error && (
          <p className="text-red-400 text-center bg-red-950/30 border border-red-700/30 py-2 rounded-md">
            {error}
          </p>
        )}

        <div>
          <label className="block mb-2 text-sm text-gray-300">Nume complet</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-[#a855f7] outline-none"
            placeholder="Numele tău"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div>
          <label className="block mb-2 text-sm text-gray-300">Rol</label>
          <select
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:border-[#a855f7] outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="influencer">Influencer</option>
            <option value="brand">Brand</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loadingRegister || success}
          style={{
            background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
            boxShadow: '0 0 12px rgba(168,85,247,0.6)',
            border: 'none',
          }}
          className="w-full py-3 rounded-lg text-white font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loadingRegister ? 'Se creează contul...' : 'Creează contul'}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Ai deja cont?{' '}
          <a href="/login" className="text-[#a855f7] hover:underline">
            Autentifică-te aici
          </a>
        </p>
      </form>
    </div>
  );
}
