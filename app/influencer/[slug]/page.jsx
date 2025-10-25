'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function PublicInfluencerProfile() {
  const { slug } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'users'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setData(snap.docs[0].data());
        } else {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white/70">
        Se încarcă profilul...
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-3">Profil inexistent</h1>
        <p className="text-white/60 mb-6">Influencerul căutat nu a fost găsit.</p>
        <Link href="/" className="text-fuchsia-400 hover:underline">
          Înapoi la pagina principală
        </Link>
      </div>
    );

  const { details, platforms, portfolio, faq } = data;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🔹 Header cover */}
      <div className="relative h-72 w-full bg-gradient-to-b from-purple-800/70 to-black">
        <Image
          src={data.coverURL || '/demo/influencer1.jpg'}
          alt="cover"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        <div className="absolute bottom-6 left-8 flex items-end gap-4">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500">
            <Image
              src={data.profileURL || '/demo/avatar.jpg'}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{details?.fullName || 'Influencer'}</h1>
            <p className="text-gray-400">{details?.city || 'Locație necunoscută'}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Descriere */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-lg text-gray-300 leading-relaxed">
          {details?.about || 'Acest influencer nu a adăugat încă o descriere.'}
        </p>
      </section>

      {/* 🔹 Platforme */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-white/10">
        <h2 className="text-2xl font-bold mb-6">Platforme și pachete</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['instagram', 'facebook', 'tiktok', 'others'].map((key) => {
            const p = platforms?.[key];
            if (!p?.description && !p?.packages) return null;
            const title =
              key === 'instagram'
                ? 'Instagram'
                : key === 'facebook'
                ? 'Facebook'
                : key === 'tiktok'
                ? 'TikTok'
                : 'Altele';
            return (
              <div
                key={key}
                className="bg-white/5 border border-white/10 p-5 rounded-xl"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                {p.description && (
                  <p className="text-gray-300 text-sm mb-3">{p.description}</p>
                )}
                {p.packages && (
                  <p className="text-fuchsia-400 font-semibold">{p.packages}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 🔹 Portofoliu */}
      {portfolio?.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-6">Portofoliu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio.map((url, i) => (
              <div
                key={i}
                className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10"
              >
                <Image
                  src={url}
                  alt={`portfolio-${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🔹 FAQ */}
      {faq?.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-6">Întrebări frecvente</h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details
                key={i}
                className="bg-white/5 border border-white/10 p-4 rounded-lg"
              >
                <summary className="cursor-pointer font-medium text-fuchsia-400">
                  {f.q}
                </summary>
                <p className="text-gray-300 mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 🔹 CTA Chat */}
      <div className="max-w-5xl mx-auto px-6 py-12 border-t border-white/10 text-center">
        {profile?.role === 'brand' ? (
          <button
            onClick={() => router.push(`/chat/${data.uid}`)}
            className="px-6 py-3 bg-fuchsia-700 hover:bg-fuchsia-800 rounded-lg font-semibold transition"
          >
            Deschide chat
          </button>
        ) : !user ? (
          <Link
            href="/register"
            className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg font-semibold transition"
          >
            Creează cont pentru a contacta
          </Link>
        ) : (
          <p className="text-white/70">
            Doar brandurile pot iniția conversații cu influencerii.
          </p>
        )}
      </div>
    </div>
  );
}
