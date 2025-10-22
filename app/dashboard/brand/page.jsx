'use client';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import CampaignCard from '@/components/CampaignCard';
import { redirect, useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function BrandDashboard() {
  const { user, profile, loading } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', budget: '', brandName: '' });
  const [list, setList] = useState([]);
  const [applications, setApplications] = useState([]); // 🟣 nou: lista de aplicații
  const router = useRouter();

  // 🟣 încărcăm campaniile brandului curent
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const q = query(collection(db, 'campaigns'), where('owner', '==', user.uid));
      const snap = await getDocs(q);
      const campaigns = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setList(campaigns);

      // 🟣 adăugăm extragerea aplicațiilor
      const apps = [];
      campaigns.forEach((c) => {
        if (Array.isArray(c.applications)) {
          c.applications.forEach((a) => {
            apps.push({
              ...a,
              campaignId: c.id,
              campaignTitle: c.title,
            });
          });
        }
      });
      setApplications(apps);
    };
    load();
  }, [user]);

  // 🟣 creare campanie (nemodificat)
  const create = async (e) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, 'campaigns'), {
      owner: user.uid,
      brandName: form.brandName || profile?.displayName || 'Brand',
      title: form.title,
      description: form.description,
      budget: Number(form.budget) || null,
      createdAt: serverTimestamp(),
      status: 'open',
      applications: [], // 🟣 important pt logica aplicațiilor
    });
    setForm({ title: '', description: '', budget: '', brandName: '' });
    const q = query(collection(db, 'campaigns'), where('owner', '==', user.uid));
    const snap = await getDocs(q);
    setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

// 🟣 inițiere / deschidere chat cu influencer
const handleChatWithInfluencer = async (influencerData) => {
  if (!user) {
    router.push('/login');
    return;
  }

  try {
    const brandId = user.uid;

    // 🧠 încearcă să găsească ID-ul influencerului din mai multe denumiri posibile
    const influencerId =
      influencerData?.influencerId ||
      influencerData?.uid ||
      influencerData?.userId ||
      influencerData?.influencerUID ||
      influencerData?.influencerUid ||
      null;

    if (!brandId || !influencerId) {
      console.warn('Influencer data:', influencerData);
      alert(
        'Datele pentru chat sunt incomplete. Verifică dacă aplicația conține UID-ul influencerului (ex: influencerId sau uid).'
      );
      return;
    }

    const chatId =
      brandId < influencerId ? `${brandId}_${influencerId}` : `${influencerId}_${brandId}`;

    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      await setDoc(chatRef, {
        participants: [brandId, influencerId],
        createdAt: serverTimestamp(),
        createdBy: brandId,
      });
      console.log(`✅ Chat creat între ${brandId} și ${influencerId}`);
    }

    router.push(`/chat/${chatId}`);
  } catch (err) {
    console.error('Eroare la inițializarea chatului:', err);
    alert('A apărut o eroare la inițializarea chatului.');
  }
};

  if (loading) return <div className="text-white/70">Se încarcă sesiunea...</div>;
  if (!user) {
    redirect('/login');
    return null;
  }
  if (profile?.role !== 'brand')
    return <div className="text-white/70">Acces permis doar pentru conturile de tip Brand.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Brand</h1>

      {/* 🟣 Formular creare campanie (nemodificat) */}
      <form onSubmit={create} className="card p-5 grid md:grid-cols-2 gap-4">
        <input
          className="px-3 py-2 rounded-lg bg-white/10"
          placeholder="Nume brand"
          value={form.brandName}
          onChange={(e) => setForm({ ...form, brandName: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-lg bg-white/10"
          placeholder="Titlu campanie"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-lg bg-white/10"
          placeholder="Buget (€)"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
        <textarea
          className="md:col-span-2 px-3 py-2 rounded-lg bg-white/10"
          rows={4}
          placeholder="Descriere"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button className="btn-primary md:col-span-2" type="submit">
          Creează campanie
        </button>
      </form>

      {/* 🟣 Lista campanii (nemodificat) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <CampaignCard key={c.id} c={c} />
        ))}
      </div>

      {/* 🟣 Nou: secțiune aplicații primite */}
      <div className="space-y-3 pt-10">
        <h2 className="text-xl font-semibold">Aplicații primite</h2>
        {applications.length === 0 ? (
          <p className="text-gray-400">Momentan nu ai aplicații la campaniile tale.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app, index) => (
              <div
                key={index}
                className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {app.influencerName || 'Influencer necunoscut'}
                  </h3>
                  <p className="text-gray-400 text-sm">{app.influencerEmail}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium text-gray-300">Campanie:</span>{' '}
                    {app.campaignTitle || '—'}
                  </p>
                </div>

                <button
                  onClick={() => handleChatWithInfluencer(app)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg py-2 bg-[#9333ea] hover:brightness-110 transition"
                >
                  <MessageCircle size={18} /> Chat
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
