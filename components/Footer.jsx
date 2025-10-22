export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-16">
      <div className="container-p text-center text-sm text-white/60">
        © {new Date().getFullYear()} BeFameous — Conectăm branduri și influenceri.
      </div>
    </footer>
  );
}
