'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function FirebaseDebug() {
  const [debugInfo, setDebugInfo] = useState({
    user: null,
    config: null,
    envCheck: null,
    error: null,
  });

  useEffect(() => {
    try {
      // ✅ verificăm configul Firebase din environment
      const envConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      };

      // ✅ ascultăm autentificarea curentă
      const unsub = onAuthStateChanged(auth, (user) => {
        setDebugInfo({
          user: user ? {
            uid: user.uid,
            email: user.email,
            provider: user.providerData?.[0]?.providerId || 'unknown',
          } : null,
          config: envConfig,
          envCheck: typeof window !== 'undefined' ? 'Browser environment OK ✅' : 'Server environment ❌',
          error: null,
        });
      });

      return () => unsub();
    } catch (err) {
      setDebugInfo((prev) => ({ ...prev, error: err.message }));
    }
  }, []);

  return (
    <div className="p-4 mt-6 rounded-lg bg-white/10 text-sm">
      <h2 className="font-bold text-lg mb-2">🔍 Firebase Debug Info</h2>
      <pre className="whitespace-pre-wrap text-white/90">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <p className="mt-2 text-xs text-white/60">
        ✅ Verifică dacă apare <b>user.uid</b> și <b>apiKey</b> (nu null).
        <br />
        Dacă apiKey = null → variabilele de mediu nu sunt încărcate corect.
        <br />
        Dacă user = null → Auth nu e persistent (probabil lipsă domeniu autorizat).
      </p>
    </div>
  );
}
