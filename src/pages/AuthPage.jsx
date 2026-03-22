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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      {/* Background Animated Blobs */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-warm-sand/20 dark:bg-dark-surface rounded-full blur-3xl blob1" />
      <div className="absolute bottom-[10%] right-[20%] w-80 h-80 bg-warm-terracotta/20 dark:bg-warm-terracotta/10 rounded-full blur-3xl blob2" />

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] bg-warm-white dark:bg-dark-surface p-8 rounded-3xl shadow-warm dark:shadow-dark border border-warm-beige dark:border-dark-border"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-warm-cream dark:bg-dark-bg rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Hand size={32} className="text-warm-terracotta" />
          </div>
          <h1 className="font-display text-4xl text-warm-brown dark:text-dark-text mb-2">GestureHub</h1>
          <p className="text-warm-muted dark:text-dark-muted font-body text-center text-sm">
            Your cozy space for gesture-controlled hardware profiles.
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
                  className="w-full px-4 py-3 rounded-2xl bg-warm-cream dark:bg-dark-bg border border-warm-beige dark:border-dark-border focus:outline-none focus:border-warm-terracotta transition-colors text-warm-brown dark:text-dark-text placeholder-warm-muted dark:placeholder-dark-muted"
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
            className="w-full px-4 py-3 rounded-2xl bg-warm-cream dark:bg-dark-bg border border-warm-beige dark:border-dark-border focus:outline-none focus:border-warm-terracotta transition-colors text-warm-brown dark:text-dark-text placeholder-warm-muted dark:placeholder-dark-muted"
          />
          
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-warm-cream dark:bg-dark-bg border border-warm-beige dark:border-dark-border focus:outline-none focus:border-warm-terracotta transition-colors text-warm-brown dark:text-dark-text placeholder-warm-muted dark:placeholder-dark-muted"
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
                  className="w-full px-4 py-3 rounded-2xl bg-warm-cream dark:bg-dark-bg border border-warm-beige dark:border-dark-border focus:outline-none focus:border-warm-terracotta transition-colors text-warm-brown dark:text-dark-text placeholder-warm-muted dark:placeholder-dark-muted mt-4"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="text-warm-red text-sm text-center animate-snake"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-warm-terracotta hover:bg-warm-terracottaHover text-white rounded-2xl font-body font-medium transition-all hover:shadow-warmHover disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin text-white" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-warm-muted dark:text-dark-text hover:text-warm-terracotta transition-colors text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
