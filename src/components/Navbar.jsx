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

  const initial = (currentUser?.displayName?.[0] || currentUser?.email?.[0] || '?').toUpperCase();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <div className="navbar-logo-icon">🖐</div>
        <span className="navbar-logo-text">GestureHub</span>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <span className="navbar-email hidden sm:block">{displayName}</span>
        <div className="navbar-avatar">{initial}</div>
        <button className="navbar-logout" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
