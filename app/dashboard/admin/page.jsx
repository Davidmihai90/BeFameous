'use client';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, XCircle, Save } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [roleChanges, setRoleChanges] = useState({}); // 🟢 memorăm modificările locale

  useEffect(() => {
    if (!user || profile?.role !== 'admin') return;

    const load = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const campaignsSnap = await getDocs(collection(db, 'campaigns'));
      setCampaigns(campaignsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    load();
  }, [user, profile]);

  if (loading) return <div className="text-white/70">Se încarcă...</div>;

  if (!user) {
    redirect('/login');
    return null;
  }

  if (profile?.role !== 'admin') {
    return <div className="text-white/70">Acces interzis — doar pentru admini.</div>;
  }

  // 🔹 acțiuni pentru campanii
  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'campaigns', id), { status: 'aprobat' });
    alert('Campania a fost aprobată ✅');
  };

  const handleBlock = async (id) => {
    await updateDoc(doc(db, 'campaigns', id), { status: 'blocat' });
    alert('Campania a fost blocată 🚫');
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'campaigns', id));
    alert('Campania a fost ștearsă ❌');
  };

  // 🟢 Schimbare rol utilizator
  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({
      ...prev,
      [userId]: newRole
    }));
  };

  const saveRoleChange = async (userId) => {
    const newRole = roleChanges[userId];
    if (!newRole) return;
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    alert(`Rolul utilizatorului a fost schimbat în ${newRole} ✅`);
    setRoleChanges((prev) => ({ ...prev, [userId]: undefined }));
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-center text-pink-400">
        Panou Administrator BeFameous
      </h1>

      {/* 🔹 Secțiune utilizatori */}
      <section>
        <h2 className="text-xl mb-4 font-semibold text-pink-300">
          Utilizatori înregistrați
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <motion.div
              key={u.id}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-black/80 via-gray-900 to-black/80 p-5 rounded-2xl border border-pink-500/30 shadow-[0_0_12px_rgba(255,100,150,0.2)] flex flex-col justify-between"
            >
              <div>
                <p className="text-white font-semibold">{u.displayName || u.email}</p>
                <p className="text-sm text-gray-400 break-all">{u.email}</p>

                <div className="mt-3">
                  <label className="text-sm text-gray-300">Rol curent:</label>
                  <select
                    value={roleChanges[u.id] ?? u.role ?? ''}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="mt-1 w-full bg-black/40 border border-pink-400/40 rounded-lg px-3 py-2 text-sm text-white"
                  >
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => saveRoleChange(u.id)}
                disabled={!roleChanges[u.id]}
                className={`mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition 
                  ${
                    roleChanges[u.id]
                      ? 'bg-pink-600 hover:bg-pink-500 text-white'
                      : 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Save size={16} />
                Salvează modificarea
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🔹 Secțiune campanii */}
      <section>
        <h2 className="text-xl mb-4 font-semibold text-pink-300">
          Campanii active
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-black/80 via-gray-900 to-black/80 p-5 rounded-2xl border border-pink-500/30 shadow-[0_0_12px_rgba(255,100,150,0.2)] flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{c.title}</h3>
                <p className="text-gray-400 text-sm mb-1">
                  Brand: {c.brandName}
                </p>
                <p className="text-gray-400 text-sm mb-1">
                  Buget: {c.budget ? `${c.budget} €` : 'nedefinit'}
                </p>
                <p className="text-gray-400 text-sm">
                  Status:{' '}
                  <span
                    className={`
                    ${c.status === 'aprobat' && 'text-green-400'}
                    ${c.status === 'blocat' && 'text-red-400'}
                    ${!c.status && 'text-yellow-400'}
                  `}
                  >
                    {c.status || 'în așteptare'}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleApprove(c.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600/30 hover:bg-green-600/50 rounded-lg text-green-300 text-sm transition"
                >
                  <CheckCircle2 size={16} /> Aprobă
                </button>
                <button
                  onClick={() => handleBlock(c.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-600/30 hover:bg-yellow-600/50 rounded-lg text-yellow-300 text-sm transition"
                >
                  <XCircle size={16} /> Blochează
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-red-300 text-sm transition"
                >
                  <Trash2 size={16} /> Șterge
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
