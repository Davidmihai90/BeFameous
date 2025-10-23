'use client';
import { useEffect, useState } from 'react';
import packageJson from '../package.json';

export default function Footer() {
  const [buildDate, setBuildDate] = useState('');

  useEffect(() => {
    const date = new Date();
    setBuildDate(
      date.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    );
  }, []);

  return (
    <footer className="text-center text-sm py-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
      <p className="text-white/70">
        BeFameous © 2025 • versiune{' '}
        <span className="text-white font-semibold">{packageJson.version}</span> • build{' '}
        <span className="text-white/80">{buildDate}</span>
      </p>
    </footer>
  );
}
