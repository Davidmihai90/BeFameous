export default function ProfileCard({ profile }) {
  return (
    <div className="card p-5 flex flex-col md:flex-row items-center gap-4">
      <img
        src={profile?.photoURL || '/avatar.png'}
        alt="avatar"
        className="h-16 w-16 rounded-full object-cover border border-white/10"
      />
      <div className="flex-1">
        <div className="font-semibold">{profile?.displayName || 'Utilizator'}</div>
        <div className="text-sm text-white/70">{profile?.role ? profile.role.capitalize : ''}</div>
        <div className="text-xs text-white/60">{profile?.bio || 'Fără descriere.'}</div>
      </div>
    </div>
  );
}
