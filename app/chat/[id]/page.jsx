'use client';
import ChatWindow from '@/components/ChatWindow';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';

export default function ChatPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white p-8">Se încarcă...</div>;
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <ChatWindow chatId={id} />
    </div>
  );
}
