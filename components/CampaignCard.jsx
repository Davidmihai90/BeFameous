'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CampaignCard({ c }) {
  return (
    <div className="flex flex-col h-full bg-white/10 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-purple-600/50 hover:shadow-[0_0_20px_rgba(155,90,255,0.3)] transition-all duration-300">
      {/* Imaginea campaniei */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={c.coverURL || '/demo/campaign-default.jpg'}
          alt={c.title || 'Campanie'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <h3 className="text-xl font-semibold text-white drop-shadow-md">
            {c.title || 'Campanie fără titlu'}
          </h3>
        </div>
      </div>

      {/* Conținutul */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        {/* Descriere scurtă */}
        <div>
          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
            {c.description || 'Această campanie nu are încă o descriere detaliată.'}
          </p>
        </div>

        {/* Informații adiționale */}
        <div className="text-xs text-gray-400 space-y-1 mb-4">
          <p>
            <span className="text-purple-400 font-medium">Brand:</span>{' '}
            {c.brandName || 'Necunoscut'}
          </p>
          {c.category && (
            <p>
              <span className="text-purple-400 font-medium">Categorie:</span>{' '}
              {c.category}
            </p>
          )}
          {c.budget && (
            <p>
              <span className="text-purple-400 font-medium">Buget:</span>{' '}
              {c.budget} €
            </p>
          )}
        </div>

        {/* Butonul */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-sm text-gray-400">
            📅 {c.deadline ? new Date(c.deadline).toLocaleDateString('ro-RO') : 'Fără termen'}
          </p>

          <Link
            href={`/campaign/${c.id}`}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 hover:shadow-[0_0_10px_rgba(155,90,255,0.4)] transition-transform"
          >
            Detalii
          </Link>
        </div>
      </div>
    </div>
  );
}
