'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function InfluencerPublicPage() {
  const { slug } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadInfluencer = async () => {
      try {
        const q = query(collection(db, 'users'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setInfluencer(snap.docs[0].data());
        } else {
          setInfluencer(null);
        }
      } catch (err) {
        console.error('Eroare la încărcarea profilului influencerului:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInfluencer();
  }, [slug]);

  const handleChat = () => {
    if (!user) {
      router.push('/register');
    } else {
      router.push(`/messages?influencer=${influencer.uid}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Se încarcă profilul influencerului...
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Influencerul nu a fost găsit.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden border-b border-white/10">
        <Image
          src={influencer.coverURL || '/demo/influencer2.jpg'}
          alt={influencer.displayName || 'Influencer cover'}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-4">
          <Image
            src={influencer.photoURL || '/demo/influencer1.jpg'}
            alt={influencer.displayName}
            width={100}
            height={100}
            className="rounded-full border-4 border-white/20"
          />
          <div>
            <h1 className="text-3xl font-bold">{influencer.displayName}</h1>
            <p className="text-gray-400 text-sm">{influencer.category || 'Categorie necompletată'}</p>
          </div>
        </div>
      </div>

      {/* Detalii Influencer */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Despre Influencer</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {influencer.description || 'Acest influencer nu a adăugat încă o descriere.'}
            </p>

            {influencer.location && (
              <p className="mt-4 text-gray-400">
                📍 <strong>Locație:</strong> {influencer.location}
              </p>
            )}

            {influencer.platforms && (
              <p className="mt-4 text-gray-400">
                💬 <strong>Platforme:</strong> {influencer.platforms.join(', ')}
              </p>
            )}

            {influencer.rating && (
              <p className="mt-2 text-purple-400">
                ⭐ <strong>Rating:</strong> {influencer.rating.toFixed(1)}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {user ? (
              profile?.role === 'brand' ? (
                <button
                  onClick={handleChat}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  💬 Contactează influencerul
                </button>
              ) : (
                <p className="text-gray-500 italic">
                  Autentificat ca {profile?.role}. Doar brandurile pot trimite mesaje.
                </p>
              )
            ) : (
              <button
                onClick={() => router.push('/register')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                📝 Creează cont pentru a contacta
              </button>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Rețele Sociale</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {influencer.instagram && (
              <Link href={influencer.instagram} target="_blank" className="hover:text-pink-400">
                Instagram
              </Link>
            )}
            {influencer.tiktok && (
              <Link href={influencer.tiktok} target="_blank" className="hover:text-gray-200">
                TikTok
              </Link>
            )}
            {influencer.youtube && (
              <Link href={influencer.youtube} target="_blank" className="hover:text-red-500">
                YouTube
              </Link>
            )}
            {influencer.facebook && (
              <Link href={influencer.facebook} target="_blank" className="hover:text-blue-500">
                Facebook
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
