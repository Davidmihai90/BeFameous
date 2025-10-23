'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import ChatWindow from '@/components/ChatWindow';

/**
 * Pagina de Chat — corectată pentru redirecționare întârziată
 * pe producție (Vercel). Nu mai redirecționează înainte ca Firebase
 * să termine încărcarea sesiunii.
 */
export default function ChatPage() {
  const { user, loading, profile } = useAuth();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);

  // 🔹 Așteaptă terminarea încărcării autentificării
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.warn('🔒 Niciun utilizator autentificat — redirect spre /');
        router.push('/');
      } else {
        console.log('✅ Utilizator autentificat:', user.email);
        setInitialized(true);
      }
    }
  }, [loading, user, router]);

  // 🔹 În timpul încărcării
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Se încarcă sesiunea...
      </div>
    );
  }

  // 🔹 Dacă nu e user (după ce s-a terminat încărcarea)
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Redirecționare către pagina principală...
      </div>
    );
  }

  // 🔹 Chat-ul propriu-zis
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Mesaje Live</h1>

        {/* Info utilizator activ */}
        <div className="mb-6 text-center text-sm text-gray-400">
          <p>Conectat ca: <span className="text-purple-400 font-medium">{user.email}</span></p>
          {profile && (
            <p>
              Rol: <span className="text-purple-300">{profile.role}</span> · UID: <span className="text-gray-500">{user.uid}</span>
            </p>
          )}
        </div>

        {/* Chat window */}
        <div className="border border-white/10 rounded-2xl bg-white/5 backdrop-blur p-4">
          <ChatWindow user={user} />
        </div>
      </div>
    </div>
  );
}
