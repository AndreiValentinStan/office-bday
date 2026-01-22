import UserGuard from '../../../guards/auth';

export default function Settings() {
  return (
    <UserGuard>
      <div className="w-full h-dvh">
        <h1>Settings</h1>
      </div>
    </UserGuard>
  );
}
