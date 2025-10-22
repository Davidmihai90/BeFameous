'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';

const AuthContext = createContext({ user: null, profile: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, profile: null, loading: true });

  // 🔴 Nou: stare globală pentru notificări
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // 🟣 Login + persistență (codul tău original)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setState({ user: null, profile: null, loading: false });
            return;
          }
          try {
            const ref = doc(db, 'users', user.uid);
            const snap = await getDoc(ref);
            setState({ user, profile: snap.exists() ? snap.data() : null, loading: false });
          } catch (err) {
            console.error('Eroare la citirea profilului:', err);
            setState({ user, profile: null, loading: false });
          }
        });
        return () => unsub();
      })
      .catch((err) => {
        console.error('Firebase persistence error:', err);
        setState({ user: null, profile: null, loading: false });
      });
  }, []);

  // 🟣 Cerem automat permisiunea de notificare o singură dată, după login
  useEffect(() => {
    if (!state.user) return;

    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission().catch(() => {});
      }, 1500);
    }
  }, [state.user]);

  // 🟣 Ascultare în timp real pentru mesaje noi din toate chat-urile
  useEffect(() => {
    if (!state.user) return;

    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', state.user.uid)
      );

      const unsubChats = onSnapshot(q, (chatSnap) => {
        chatSnap.docs.forEach((chatDoc) => {
          const chatId = chatDoc.id;
          const messagesRef = collection(db, 'chats', chatId, 'messages');

          const unsubMessages = onSnapshot(
            query(messagesRef, orderBy('timestamp', 'desc')),
            (msgSnap) => {
              if (msgSnap.empty) return;
              const lastMsg = msgSnap.docs[0].data();

              // Evităm notificările pentru propriile mesaje
              if (lastMsg.senderId === state.user.uid) return;

              // Evităm notificările dacă utilizatorul e deja în pagina acelui chat
              if (window.location.pathname === `/chat/${chatId}`) return;

              // 🔴 Setăm indicator global de mesaj nou
              setHasNewMessage(true);

			window.dispatchEvent(new Event('newMessage'));
			console.log("📩 Notificare detectată în AuthProvider!");
			
              const fromUser = chatId.split('_').find((id) => id !== state.user.uid);
              const messageText =
                lastMsg.text?.length > 60
                  ? lastMsg.text.slice(0, 60) + '…'
                  : lastMsg.text || 'Mesaj nou';

              // 🔔 Notificare browser
              if (Notification.permission === 'granted') {
                new Notification('💬 Mesaj nou', {
                  body: messageText,
                  icon: '/logo.svg',
                });
              }

              // 🔊 Sunet notificare
              const audio = new Audio('/sounds/new-message.mp3');
              audio.volume = 0.4;
              audio.play().catch(() => {});
            }
          );
        });
      });

      return () => unsubChats();
    } catch (err) {
      console.error('Eroare la ascultarea notificărilor de mesaje:', err);
    }
  }, [state.user]);

  if (state.loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white/70">
      Se încarcă sesiunea...
    </div>
  );
}

  return (
    <AuthContext.Provider value={{ ...state, hasNewMessage, setHasNewMessage }}>
      {children}
    </AuthContext.Provider>
  );
}
