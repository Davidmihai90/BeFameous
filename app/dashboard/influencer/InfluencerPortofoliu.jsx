'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/components/AuthProvider';

export default function InfluencerPortofoliu() {
  const { user, profile } = useAuth();
  const [images, setImages] = useState(profile?.portfolioImages || []);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    if (!user || !files?.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const path = `portfolio/${user.uid}/${Date.now()}-${file.name}`;
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        uploaded.push(url);
      }
      const next = [...images, ...uploaded];
      setImages(next);
      await updateDoc(doc(db, 'users', user.uid), { portfolioImages: next });
    } catch (err) {
      console.error(err);
      alert('Eroare la încărcare.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (idx) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    try {
      await updateDoc(doc(db, 'users', user.uid), { portfolioImages: next });
    } catch (err) {
      console.error(err);
      alert('Eroare la salvare.');
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-2">Portofoliu — galerie foto</h2>
      <p className="text-white/60 mb-4 text-sm">
        Încarcă imagini reprezentative (proiecte, cadre din content, rezultate).
      </p>

      <div className="mb-4">
        <label className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/15 rounded-lg cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? 'Se încarcă…' : '⬆️ Încarcă imagini'}
        </label>
      </div>

      {images?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <div key={i} className="relative group border border-white/10 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`img-${i}`} className="w-full h-40 object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/60 hover:bg-black/80 rounded"
              >
                Șterge
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/60">Nu ai imagini încărcate momentan.</p>
      )}
    </div>
  );
}
