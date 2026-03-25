import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
        await setDoc(doc(db, "users", user.uid), {
          name: fullName || email.split('@')[0],
          email: user.email,
          createdAt: serverTimestamp()
        });
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
    <div className="auth-page">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="auth-card"
      >
        {/* Logo */}
        <div className="auth-logo-icon">🖐</div>
        <h1 className="auth-title">GestureHub</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back. Sign in to continue.' : 'Create your account to get started.'}
        </p>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="fullname"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="auth-input"
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
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="confirm"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center' }}
            >
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading} className="auth-btn">
            {loading
              ? <Loader2 size={18} className="animate-spin" />
              : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
