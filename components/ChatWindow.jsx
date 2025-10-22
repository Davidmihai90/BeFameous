'use client';
import { useState, useEffect, useRef } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import MessageBubble from './MessageBubble';
import { useAuth } from './AuthProvider';

export default function ChatWindow({ chatId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!chatId || !user) return;

    // 🟣 1️⃣ Asigurăm existența documentului principal de chat
    const ensureChatExists = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
          const [uid1, uid2] = chatId.split('_');
          await setDoc(chatRef, {
            participants: [uid1, uid2],
            createdAt: serverTimestamp(),
          });
          console.log(`✅ Chat document created: ${chatId}`);
        }
      } catch (err) {
        console.error('Eroare la crearea documentului de chat:', err);
      }
    };

    ensureChatExists();

    // 🟣 2️⃣ Abonare în timp real la mesaje
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => unsub();
  }, [chatId, user]);

  // 🟣 3️⃣ Trimiterea unui mesaj
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        text: input.trim(),
        timestamp: serverTimestamp(),
      });
      setInput('');
    } catch (err) {
      console.error('Eroare la trimiterea mesajului:', err);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto bg-black/50 border border-white/10 rounded-2xl shadow-lg">
      {/* Zona mesajelor */}
      <div className="flex flex-col flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} text={msg.text} isSender={msg.senderId === user?.uid} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input jos */}
      <form onSubmit={sendMessage} className="p-3 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie un mesaj..."
          className="flex-grow bg-white/10 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#a855f7]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-[#9333ea] to-[#a855f7] hover:brightness-110 transition disabled:opacity-50"
        >
          Trimite
        </button>
      </form>
    </div>
  );
}
