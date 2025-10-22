# BeFameous – Next.js + Firebase (Dark Mode)

Proiect complet de start pentru marketplace-ul BeFameous.
- Next.js 14 (App Router), React 18
- Firebase (Auth, Firestore, Storage)
- Tailwind (dark mode), design premium minimal
- Dashboard Brand/Influencer, Campanii, Profile

## Setup local
1. Copiază `.env.example` în `.env.local` și completează cheile Firebase.
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Firebase
- Creează proiect Firebase.
- Activează Authentication (Email/Password + Google).
- Creează Firestore Database în modul „Production”.
- Storage este opțional pentru avatare/banner.

## Deploy pe cPanel (Node.js app)
1. În cPanel → Setează o aplicație Node.js (Node 18+), directorul proiectului.
2. Rulează `npm install` din terminal (cPanel Terminal).
3. Setează variabila `PORT=3000` (dacă e nevoie).
4. Comandă de start: `npm run start` (după `npm run build`).  
   - Rulează: `npm run build` apoi `npm run start` (Production server).
5. Configurează un reverse proxy (Apache) către portul aplicației (cPanel o face automat prin Passenger).
6. Punctează domeniul `befameous.ro` către directorul aplicației.

### Alternativ (recomandat): Vercel
- Conectează repo la Vercel → Deploy automat.
- Setează variabilele `.env` în Project Settings → Environment Variables.

## Rute principale
- `/` – homepage
- `/login` – autentificare
- `/register` – creare cont cu rol (brand/influencer)
- `/dashboard/brand` – creare & listare campanii (proprietar)
- `/dashboard/influencer` – listare campanii & aplicare
- `/campaigns` – listă publică campanii
- `/profile/[id]` – profil public utilizator

> NOTĂ: Codul este minimal și sigur pentru extensie ulterioară (chat, notificări, filtre, etc).
