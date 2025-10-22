'use client';
import Link from 'next/link';

export default function ChatListItem({ chatId, otherUser, lastMessage }) {
  return (
    <Link
      href={`/chat/${chatId}`}
      className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl hover:bg-white/10 transition"
    >
      <div>
        <p className="text-white font-semibold">{otherUser?.name || 'Utilizator necunoscut'}</p>
        <p className="text-gray-400 text-sm truncate max-w-[250px]">
          {lastMessage || 'Fără mesaje încă...'}
        </p>
      </div>
      <span className="text-sm text-[#a855f7]">Deschide chat</span>
    </Link>
  );
}
