'use client';

import { useEffect, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function BrandImages() {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [coverUrl, setCoverUrl] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const refUser = doc(db, 'users', user.uid);
      const snap = await getDoc(refUser);
      if (snap.exists()) {
        const d = snap.data();
        setCoverUrl(d.coverPhoto || '');
        setProfileUrl(d.profilePhoto || '');
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const handleUpload = async (file, path) => {
    const storageRef = ref(storage, `${path}/${user.uid}-${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const onUploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setSaving(true);
    try {
      const url = await handleUpload(file, 'brand/cover');
      setCoverUrl(url);
    } finally {
      setSaving(false);
    }
  };

  const onUploadProfile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setSaving(true);
    try {
      const url = await handleUpload(file, 'brand/profile');
      setProfileUrl(url);
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const refUser = doc(db, 'users', user.uid);
      const payload = { coverPhoto: coverUrl, profilePhoto: profileUrl };
      const snap = await getDoc(refUser);
      if (snap.exists()) await updateDoc(refUser, payload);
      else await setDoc(refUser, { role: 'brand', ...payload });
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div className="text-white/70">Se încarcă...</div>;

  return (
    <div className="card bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Imagini</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cover */}
        <div className="space-y-3">
          <p className="text-white/80 text-sm">Cover Photo (ex: 1200×400px)</p>
          {coverUrl ? (
            <img src={coverUrl} alt="cover" className="w-full h-40 object-cover rounded-lg border border-white/10" />
          ) : (
            <div className="w-full h-40 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center text-white/40">
              niciun cover încă
            </div>
          )}
          <input type="file" accept="image/*" onChange={onUploadCover} className="block text-sm" />
        </div>

        {/* Profile */}
        <div className="space-y-3">
          <p className="text-white/80 text-sm">Profile Photo (ex: 400×400px)</p>
          {profileUrl ? (
            <img src={profileUrl} alt="profile" className="w-40 h-40 object-cover rounded-full border border-white/10" />
          ) : (
            <div className="w-40 h-40 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-white/40">
              fără poză
            </div>
          )}
          <input type="file" accept="image/*" onChange={onUploadProfile} className="block text-sm" />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 btn-primary bg-fuchsia-700 hover:bg-fuchsia-800 px-5 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? 'Se salvează...' : 'Salvează'}
      </button>
    </div>
  );
}
