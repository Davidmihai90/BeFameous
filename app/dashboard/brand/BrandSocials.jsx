'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

export default function BrandSocials() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [youtube, setYoutube] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setWebsite(d.socials?.website || '');
        setInstagram(d.socials?.instagram || '');
        setFacebook(d.socials?.facebook || '');
        setTiktok(d.socials?.tiktok || '');
        setYoutube(d.socials?.youtube || '');
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const ref = doc(db, 'users', user.uid);
      const payload = {
        socials: { website, instagram, facebook, tiktok, youtube }
      };
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, { role: 'brand', ...payload });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div className="text-white/70">Se încarcă...</div>;

  const Input = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm mb-2 text-white/80">{label}</label>
      <input
        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 focus:outline-none focus:border-fuchsia-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="card bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Social Media</h2>

      <Input label="Website"   value={website}   onChange={setWebsite}   placeholder="https://brandulmeu.ro" />
      <Input label="Instagram" value={instagram} onChange={setInstagram} placeholder="@brandulmeu sau link profil" />
      <Input label="Facebook"  value={facebook}  onChange={setFacebook}  placeholder="https://facebook.com/brandulmeu" />
      <Input label="TikTok"    value={tiktok}    onChange={setTiktok}    placeholder="@brandulmeu sau link profil" />
      <Input label="YouTube"   value={youtube}   onChange={setYoutube}   placeholder="https://youtube.com/@brandulmeu" />

      <button
        onClick={save}
        disabled={saving}
        className="mt-2 btn-primary bg-fuchsia-700 hover:bg-fuchsia-800 px-5 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? 'Se salvează...' : 'Salvează'}
      </button>
    </div>
  );
}
