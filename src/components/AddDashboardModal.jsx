import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const COLORS = [
  { name: 'terracotta', hex: '#E07B39' },
  { name: 'sand', hex: '#C9A96E' },
  { name: 'sage', hex: '#5D8A4E' },
  { name: 'clay', hex: '#B05B3B' },
  { name: 'rust', hex: '#9C4A28' }
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
        name,
        colorTag,
        icon,
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#2D1F0E]/40 backdrop-blur-sm"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative bg-warm-white dark:bg-dark-surface w-full max-w-[480px] rounded-[24px] p-8 shadow-warmHover dark:shadow-darkHover border border-warm-beige dark:border-dark-border"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-warm-muted hover:text-warm-red transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-2xl font-bold mb-6 text-warm-brown dark:text-dark-text">New Dashboard</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-warm-brown dark:text-dark-muted">Dashboard Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Office Setup"
              className="w-full px-4 py-3 rounded-2xl bg-warm-cream dark:bg-dark-bg border border-warm-beige dark:border-dark-border focus:outline-none focus:border-warm-terracotta transition-colors text-warm-brown dark:text-dark-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-warm-brown dark:text-dark-muted">Color Theme</label>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColorTag(c.name)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${colorTag === c.name ? 'scale-110 border-warm-brown dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-warm-brown dark:text-dark-muted">Choose Icon</label>
            <div className="grid grid-cols-6 gap-2 bg-warm-cream dark:bg-dark-bg p-3 rounded-2xl border border-warm-beige dark:border-dark-border">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`text-2xl p-2 rounded-xl transition-all ${icon === e ? 'bg-warm-terracotta/20 scale-110' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-warm-terracotta hover:bg-warm-terracottaHover text-white rounded-2xl font-body font-medium transition-all hover:shadow-warmHover disabled:opacity-70"
          >
            {loading ? 'Creating...' : 'Create Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
