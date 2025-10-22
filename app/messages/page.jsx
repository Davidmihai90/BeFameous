'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import ChatListItem from '@/components/ChatListItem';
import { redirect } from 'next/navigation';

export default function MessagesPage() {
  const { user, loading, setHasNewMessage } = useAuth(); // 🟣 folosim global badge reset
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!user) return;

    // 🟣 resetăm badge-ul global la intrarea pe /messages
    setHasNewMessage(false);

    // 🟣 Găsim toate chat-urile în care userul curent este participant
    const q = query(collection(db, 'chats'));
    const unsub = onSnapshot(q, async (snapshot) => {
      const userChats = [];
      for (const docSnap of snapshot.docs) {
        const chatData = docSnap.data();
        if (chatData.participants?.includes(user.uid)) {
          // 🔹 Citim ultimul mesaj (opțional)
          const messagesRef = collection(db, 'chats', docSnap.id, 'messages');
          const lastMsgQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
          const lastMsgSnap = await getDocs(lastMsgQuery);
          const lastMessage = lastMsgSnap.docs[0]?.data()?.text || '';

          // 🔹 Identificăm celălalt participant
          const otherId = chatData.participants.find((id) => id !== user.uid);
          let otherUser = null;
          if (otherId) {
            const otherDoc = await getDoc(doc(db, 'users', otherId));
            otherUser = otherDoc.exists()
              ? otherDoc.data()
              : { name: 'Utilizator necunoscut' };
          }

          userChats.push({
            id: docSnap.id,
            otherUser,
            lastMessage,
          });
        }
      }
      setChats(userChats);
    });

    return () => unsub();
  }, [user, setHasNewMessage]);

  if (loading) return <div className="text-white p-8">Se încarcă...</div>;
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Mesajele mele</h1>

      {chats.length === 0 ? (
        <p className="text-gray-400">Nu ai conversații încă.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chats.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-black/50 border border-white/10 rounded-2xl hover:border-pink-500 transition"
            >
              <ChatListItem
                chatId={c.id}
                otherUser={c.otherUser}
                lastMessage={c.lastMessage}
              />
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .chat-card {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
