'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, hasNewMessage, setHasNewMessage } = useAuth();

  // 🔹 Stare locală pentru afișarea badge-ului (vizual)
  const [showBadge, setShowBadge] = useState(false);

  // 🔁 Sincronizăm badge-ul local cu cel global
  useEffect(() => {
    setShowBadge(hasNewMessage);
  }, [hasNewMessage]);

  // 🧭 Ascultăm evenimentul global „newMessage” emis de AuthProvider
  useEffect(() => {
    const handler = () => {
      setShowBadge(true);
    };
    window.addEventListener('newMessage', handler);
    return () => window.removeEventListener('newMessage', handler);
  }, []);

  const link = (href, label) => (
    <Link
      href={href}
      className={clsx(
        'px-3 py-2 rounded-lg hover:bg-white/10 transition',
        pathname === href && 'bg-white/15'
      )}
    >
      {label}
    </Link>
  );

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // 🟣 Resetăm badge-ul când intră pe pagini de mesaje
  useEffect(() => {
    if (pathname.startsWith('/messages') || pathname.startsWith('/chat/')) {
      setHasNewMessage(false);
      setShowBadge(false);
    }
  }, [pathname]);

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Utilizator';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="container-p flex items-center gap-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="BeFameous" width={140} height={80} priority />
        </Link>

        {/* Meniu */}
        <nav className="ml-auto flex items-center gap-1 relative">
          {link('/', 'Acasă')}
          {link('/campaigns', 'Campanii')}

          {/* 🟣 Link “Mesaje” cu badge luxury */}
          <div className="relative">
            {link('/messages', 'Mesaje')}
            {showBadge && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-br from-red-500 via-pink-500 to-yellow-400 border-[2px] border-pink-200 rounded-full shadow-[0_0_8px_rgba(255,100,150,0.9)] animate-bounce-badge" />
            )}
          </div>

          {/* dacă e logat ca brand */}
          {user && profile?.role === 'brand' && link('/dashboard/brand', 'Dashboard Brand')}

          {/* dacă e logat ca influencer */}
          {user && profile?.role === 'influencer' && link('/dashboard/influencer', 'Dashboard Influencer')}

          {/* dacă NU e logat */}
          {!user && link('/login', 'Login')}
          {!user && link('/register', 'Register')}

          {/* dacă e logat */}
          {user && (
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm text-white/80">
                👤 Salut, <strong>{displayName}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-medium transition"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* 🔴 Stil global pentru animația badge-ului */}
      <style jsx global>{`
        @keyframes pulseBadge {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.85; }
        }

        @keyframes bounceBadge {
          0% { transform: scale(0.3) translateY(-8px); opacity: 0; }
          60% { transform: scale(1.3) translateY(0); opacity: 1; }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }

        .animate-bounce-badge {
          animation:
            bounceBadge 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
            pulseBadge 1.5s infinite ease-in-out 0.5s;
        }
      `}</style>
    </header>
  );
}
