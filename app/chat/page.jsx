'use client';
export const dynamic = 'force-dynamic'; // dezactivează prerender SSR pentru /chat

import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  return <ChatWindow />;
}
