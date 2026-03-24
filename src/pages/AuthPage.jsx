import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Hand, Loader2 } from 'lucide-react';
import { PREDEFINED_TASKS } from '../constants/predefinedTasks';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const seedDashboards = async (uid) => {
    const dashboards = [
      { name: "Office Setup", colorTag: "terracotta", icon: "🏢" },
      { name: "Home Theater", colorTag: "sand", icon: "🍿" },
      { name: "Presentation", colorTag: "sage", icon: "📊" }
    ];

    for (const dashboard of dashboards) {
      const dbRef = await addDoc(collection(db, "users", uid, "dashboards"), {
        ...dashboard,
        createdAt: serverTimestamp()
      });

      // Seed 6 default tasks
      const defaultTasks = PREDEFINED_TASKS.slice(0, 6);
      for (const task of defaultTasks) {
        await addDoc(collection(db, "users", uid, "dashboards", dbRef.id, "tasks"), {
          ...task,
          isDefault: true,
          createdAt: serverTimestamp()
        });
      }
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // Create user doc
        await setDoc(doc(db, "users", user.uid), {
          name: fullName || email.split('@')[0],
          email: user.email,
          createdAt: serverTimestamp()
        });

        // Seed Dashboards
        await seedDashboards(user.uid);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-page)' }}>
      {/* Subtle accent blobs */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'var(--accent-soft)' }} />
      <div className="absolute bottom-[10%] right-[20%] w-80 h-80 rounded-full blur-3xl opacity-50 pointer-events-none" style={{ background: 'var(--accent-soft)' }} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] p-10 rounded-[20px]"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}
          >
            <Hand size={32} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2" style={{ color: 'var(--text-primary)' }}>GestureHub</h1>
          <p className="font-body text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your space for gesture-controlled hardware profiles.
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl font-body transition-all"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl font-body transition-all"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl font-body transition-all"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required={!isLogin}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl font-body transition-all mt-4"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm text-center"
              style={{ color: 'var(--danger)' }}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-white rounded-xl font-body font-semibold transition-all flex justify-center items-center disabled:opacity-70"
            style={{ background: 'var(--accent)' }}
            onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
