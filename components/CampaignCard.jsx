'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { MessageCircle } from 'lucide-react';

/**
 * c  -> obiectul campaniei (trebuie să conțină cel puțin id, title, description, budget, brandName)
 * onApply (opțional) -> handler-ul tău existent. Dacă lipsește, butonul Aplică face redirect corect.
 * showApplyButton (opțional) -> afișează/ascunde butonul Aplică (default: true)
 */
export default function CampaignCard({ c, onApply, showApplyButton = true }) {
  const { user, profile } = useAuth();
  const router = useRouter();

  // ——— Utilitare ———
  const isLogged = !!user;
  const role = profile?.role;
  const isInfluencer = isLogged && role === 'influencer';
  const isBrand = isLogged && role === 'brand';

  // încercăm să deducem brandId din mai multe denumiri posibile (în funcție de cum e salvată campania)
  const getBrandId = () =>
    c?.brandId || c?.brandUID || c?.brandUid || c?.ownerId || c?.owner || c?.createdBy || null;

  // ——— ACTION: Aplică ———
  const handleApply = () => {
    // dacă ai deja un handler extern, îl păstrăm
    if (typeof onApply === 'function') {
      onApply(c);
      return;
    }
    // fallback sigur:
    if (!isLogged) {
      router.push('/login');
      return;
    }
    if (isInfluencer) {
      router.push(`/campaigns/${c.id}`);
      return;
    }
    // brand sau alt rol
    alert('Doar influencerii pot aplica la campanii.');
  };

  // ——— ACTION: Chat ——— (vizibil doar pentru influenceri logați)
  const handleChat = async () => {
    if (!isLogged) {
      router.push('/login');
      return;
    }
    if (!isInfluencer) {
      alert('Chatul poate fi inițiat de pe card doar de către un influencer.');
      return;
    }

    const brandId = getBrandId();
    const influencerId = user.uid;

    if (!brandId) {
      console.warn('brandId lipsește din campanie:', c);
      alert(
        'Datele pentru chat sunt incomplete (lipsește brandId în campanie). ' +
          'Asigură-te că salvezi UID-ul brandului în câmpul „brandId” la crearea campaniei.'
      );
      return;
    }

    try {
      // chatId stabilit alfabetic ca să nu existe duplicate
      const chatId = brandId < influencerId ? `${brandId}_${influencerId}` : `${influencerId}_${brandId}`;

      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [brandId, influencerId],
          createdAt: serverTimestamp(),
          // opțional: poți salva meta despre campanie
          campaignId: c.id || null,
          campaignTitle: c.title || null,
        });
        console.log(`✅ Chat creat: ${chatId}`);
      } else {
        console.log(`💬 Chat existent: ${chatId}`);
      }

      router.push(`/chat/${chatId}`);
    } catch (err) {
      console.error('Eroare la inițializarea chatului:', err);
      alert('A apărut o eroare la inițializarea chatului.');
    }
  };

  // ——— UI ———
  return (
    <motion.div
      className="flex flex-col justify-between p-4 bg-black/50 border border-white/10 rounded-2xl shadow-lg hover:bg-white/5 transition"
      whileHover={{ scale: 1.01 }}
    >
      {/* Detalii campanie */}
      <div>
        <h3 className="text-lg font-semibold mb-1 text-white">{c?.title || 'Campanie'}</h3>
        <p className="text-sm text-gray-400 mb-2">{c?.brandName || 'Brand necunoscut'}</p>
        {c?.description && <p className="text-gray-300 text-sm mb-3">{c.description}</p>}
        <div className="flex items-center justify-between text-sm border-t border-white/10 pt-2">
          <span className="text-green-400">€ {c?.budget ?? '—'}</span>
          <span className="text-gray-400">{c?.date || ''}</span>
        </div>
      </div>

      {/* Butoane */}
      <div className="mt-4 flex flex-col gap-2">
        {/* Aplică (păstrat; acum are fallback corect & gradient inline ca să nu-ți piardă culoarea) */}
        {showApplyButton && (
          <button
            onClick={handleApply}
            style={{
              background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 100%)',
              boxShadow: '0 0 12px rgba(168,85,247,0.6)',
              border: 'none',
            }}
            className="w-full py-2 rounded-lg font-medium text-white hover:brightness-110 transition"
          >
            Aplică
          </button>
        )}

        {/* Chat – vizibil doar pentru influenceri logați */}
        {isInfluencer && (
          <button
            onClick={handleChat}
            className="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title={getBrandId() ? 'Deschide chat cu brandul' : 'Lipsește brandId în campanie'}
          >
            <MessageCircle size={18} />
            Chat
          </button>
        )}
      </div>
    </motion.div>
  );
}
