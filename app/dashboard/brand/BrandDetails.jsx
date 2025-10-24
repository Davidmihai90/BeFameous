'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';

// listă locală (poți extinde oricât dorești)
const ROMANIA_CITIES = [
  'București','Cluj-Napoca','Timișoara','Iași','Constanța','Brașov','Craiova','Galați','Ploiești',
  'Oradea','Brăila','Arad','Pitești','Sibiu','Bacău','Târgu Mureș','Baia Mare','Buzău','Botoșani',
  'Satu Mare','Râmnicu Vâlcea','Drobeta-Turnu Severin','Suceava','Piatra Neamț','Târgoviște','Focșani',
  'Bistrița','Tulcea','Reșița','Slatina','Călărași','Alba Iulia','Giurgiu','Deva','Hunedoara',
  'Vaslui','Zalău','Sfântu Gheorghe','Bârlad','Roman','Turda','Mediaș','Alexandria','Voluntari',
  'Miercurea Ciuc','Odorheiu Secuiesc','Petroșani','Rădăuți','Târgu Jiu','Târgu Secuiesc','Tecuci',
  'Lugoj','Onești','Campina','Sighetu Marmației','Făgăraș','Fetești','Câmpulung','Carei','Cernavodă'
];

const CATEGORIES = [
  'Beauty','Fashion','Travel','Food & Drinks','Fitness','Tech','Entertainment','Education','Gaming',
  'Lifestyle','Parenting','Health','Finance','Art','Sport','Automotive','Home & Deco','Pets'
];

export default function BrandDetails() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [city, setCity] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');

  const [query, setQuery] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

  const suggestions = useMemo(() => {
    if (query.trim().length < 3) return [];
    const q = query.toLowerCase();
    return ROMANIA_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setCity(d.city || '');
        setDesc(d.description || '');
        setCategory(d.category || '');
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
      const snap = await getDoc(ref);
      const payload = { city, description: desc, category };
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

  return (
    <div className="card bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Detalii Brand</h2>

      {/* Locație cu autosuggest */}
      <div className="mb-4 relative">
        <label className="block text-sm mb-2 text-white/80">Locație (oraș din România)</label>
        <input
          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 focus:outline-none focus:border-fuchsia-500"
          placeholder="Ex: București"
          value={query || city}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggest(true);
          }}
          onFocus={() => setShowSuggest(query.trim().length >= 3)}
        />
        {showSuggest && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-black/90 border border-white/10 rounded-lg max-h-56 overflow-auto">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-white/10"
                onClick={() => {
                  setCity(s);
                  setQuery(s);
                  setShowSuggest(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Descriere */}
      <div className="mb-4">
        <label className="block text-sm mb-2 text-white/80">Descriere</label>
        <textarea
          rows={5}
          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 focus:outline-none focus:border-fuchsia-500"
          placeholder="Povestea brandului, valori, produse/servicii..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* Categorie */}
      <div className="mb-6">
        <label className="block text-sm mb-2 text-white/80">Categorie</label>
        <select
          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 focus:outline-none focus:border-fuchsia-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Alege o categorie...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="btn-primary bg-fuchsia-700 hover:bg-fuchsia-800 px-5 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? 'Se salvează...' : 'Salvează'}
      </button>
    </div>
  );
}
