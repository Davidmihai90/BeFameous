import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <section className="mt-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            BeFameous
            <span className="block text-white/70 mt-2">Conectăm branduri și influenceri</span>
          </h1>
          <p className="text-white/70 max-w-prose">
            Creează colaborări reale, transparente și rapide. Publică campanii, aplică inteligent și
            urmărește rezultatele în timp real. Platformă construită cu Next.js + Firebase.
          </p>
          <div className="flex gap-3">
            <Link href="/register" className="btn-primary">Înregistrează-te</Link>
            <Link href="/login" className="btn-ghost">Autentifică-te</Link>
          </div>
        </div>
        <div className="card p-6">
          <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-brand/30 to-brand/10 border border-white/10 flex items-center justify-center">
            <Image src="/logo.svg" alt="BeFameous" width={96} height={96} />
          </div>
          <p className="text-xs text-white/50 mt-3">
            Logo cu fundal transparent • Dark mode • UI rapid.
          </p>
        </div>
      </div>
    </section>
  );
}
