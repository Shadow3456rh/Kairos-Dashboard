import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Rocket } from 'lucide-react';
import TaskTile from './TaskTile';

const colorMap = {
  terracotta: 'bg-warm-terracotta/10 border-warm-terracotta/20 text-warm-terracotta',
  sand: 'bg-warm-sand/10 border-warm-sand/20 text-warm-sand',
  sage: 'bg-warm-green/10 border-warm-green/20 text-warm-green',
  clay: 'bg-[#B05B3B]/10 border-[#B05B3B]/20 text-[#B05B3B]',
  rust: 'bg-[#9C4A28]/10 border-[#9C4A28]/20 text-[#9C4A28]',
};

export default function ProfileCard({ dashboard, onDelete, onAddTask }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [launchStatus, setLaunchStatus] = useState(null); // 'pending' | 'success' | 'error' | null

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(db, "users", currentUser.uid, "dashboards", dashboard.id, "tasks"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [currentUser, dashboard.id]);

  const handleDeleteTask = async (taskId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "dashboards", dashboard.id, "tasks", taskId));
  };

  const handleLaunch = async () => {
    setLaunchStatus('pending');

    try {
      // Optional backend fetch stub
      await fetch(`http://localhost:5000/api/launch/${dashboard.id}`, { method: 'POST' });
    } catch (err) {
      console.warn("Backend not running, but logging fake interaction");
    }

    // Fake timeout delay
    setTimeout(() => {
      setLaunchStatus(Math.random() > 0.5 ? 'success' : 'error');
      setTimeout(() => setLaunchStatus(null), 3000);
    }, 2000);
  };

  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ y: -4 }}
      className="bg-warm-white dark:bg-dark-surface rounded-3xl p-6 shadow-warm dark:shadow-dark hover:shadow-warmHover dark:hover:shadow-darkHover transition-all border border-warm-beige dark:border-dark-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border ${colorMap[dashboard.colorTag] || colorMap.sand}`}>
          <span className="text-xl">{dashboard.icon}</span>
          <h3 className="font-display font-bold text-lg">{dashboard.name}</h3>
        </div>
        <button
          onClick={onDelete}
          className="p-2 text-warm-muted hover:text-warm-red dark:text-dark-muted dark:hover:text-warm-red transition-colors rounded-full hover:bg-warm-red/10"
          title="Delete Profile"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Grid of Tasks */}
      <div className="grid grid-cols-2 gap-3 mb-6 flex-grow">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskTile key={task.id} task={task} onDelete={() => handleDeleteTask(task.id)} />
          ))}
          {/* Add Task Button (Empty Tile state) */}
          <motion.button
            layout
            onClick={onAddTask}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-warm-beige dark:border-dark-border hover:border-warm-terracotta dark:hover:border-warm-terracotta text-warm-muted hover:text-warm-terracotta transition-colors h-[100px]"
          >
            <Plus size={24} className="mb-1" />
            <span className="text-xs font-medium">Add Task</span>
          </motion.button>
        </AnimatePresence>
      </div>

      {/* Footer / Launch Button */}
      <button
        onClick={handleLaunch}
        disabled={launchStatus === 'pending'}
        className={`w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2 relative overflow-hidden
          ${launchStatus === 'pending' ? 'bg-warm-beige text-warm-brown cursor-not-allowed dark:bg-dark-border dark:text-dark-muted' :
            launchStatus === 'success' ? 'bg-warm-green text-white' :
              launchStatus === 'error' ? 'bg-warm-red text-white' :
                'bg-warm-brown text-warm-cream hover:bg-black dark:bg-warm-cream dark:text-dark-bg hover:dark:bg-white shadow-sm'}`}
      >
        {launchStatus === 'pending' && <span className="w-5 h-5 border-2 border-warm-brown/30 border-t-warm-brown rounded-full animate-spin"></span>}
        {launchStatus === 'success' && <span>Device Connected ✓</span>}
        {launchStatus === 'error' && <span>No device found</span>}
        {!launchStatus && (
          <>
            <Rocket size={18} /> Launch Status
          </>
        )}
      </button>
    </motion.div>
  );
}
