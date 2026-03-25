import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const COLORS = [
  { name: 'terracotta', hex: '#E07B39' },
  { name: 'sand',       hex: '#C9A96E' },
  { name: 'sage',       hex: '#5D8A4E' },
  { name: 'clay',       hex: '#B05B3B' },
  { name: 'rust',       hex: '#9C4A28' },
];

const EMOJIS = ['🖐', '🍿', '📊', '💻', '🎮', '🎵', '🏠', '🚗', '📚', '🏃‍♂️', '☕', '💡'];

export default function AddDashboardModal({ onClose }) {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [colorTag, setColorTag] = useState('terracotta');
  const [icon, setIcon] = useState('🖐');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "users", currentUser.uid, "dashboards"), {
        name, colorTag, icon, createdAt: serverTimestamp()
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="modal-card"
        style={{ position: 'relative' }}
      >
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <h2 className="modal-title">New Dashboard</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>
          Give your gesture profile a name and icon.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Dashboard Name
            </label>
            <input
              type="text" required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Office Setup"
              className="modal-input"
            />
          </div>

          {/* Color */}
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Color Tag
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {COLORS.map(c => (
                <button
                  key={c.name} type="button"
                  onClick={() => setColorTag(c.name)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    backgroundColor: c.hex, border: 'none', cursor: 'pointer',
                    outline: colorTag === c.name ? `3px solid var(--amber)` : '3px solid transparent',
                    outlineOffset: 2,
                    transform: colorTag === c.name ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              Icon
            </label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6,
              background: 'var(--bg-card)', padding: 10, borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              {EMOJIS.map(e => (
                <button
                  key={e} type="button"
                  onClick={() => setIcon(e)}
                  style={{
                    fontSize: 22, padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: icon === e ? 'var(--amber-soft)' : 'transparent',
                    outline: icon === e ? '1px solid var(--amber-border)' : 'none',
                    transform: icon === e ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="modal-save-btn">
            {loading ? 'Creating…' : 'Create Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
