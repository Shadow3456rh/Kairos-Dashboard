import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
          <span className="text-xl">🖐</span>
        </div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>GestureHub</h1>
      </div>

      {/* User Area */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {currentUser?.displayName || currentUser?.email?.split('@')[0]}
          </span>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: 'var(--accent)' }}
          >
            {currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase()}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-full transition-colors"
          style={{ color: 'var(--text-muted)' }}
          title="Logout"
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
