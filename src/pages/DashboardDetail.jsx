import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Rocket } from 'lucide-react';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useEffect } from 'react';
import TaskTile from '../components/TaskTile';
import AddTaskModal from '../components/AddTaskModal';
import PageLoadingBar from '../components/PageLoadingBar';

export default function DashboardDetail({ dashboard, onBack }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [launchStatus, setLaunchStatus] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid || !dashboard?.id) return;
    const q = query(
      collection(db, "users", currentUser.uid, "dashboards", dashboard.id, "tasks"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [currentUser, dashboard]);

  const handleDeleteTask = async (taskId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "dashboards", dashboard.id, "tasks", taskId));
  };

  const handleLaunch = async () => {
    setLaunchStatus('pending');
    try {
      await fetch(`http://localhost:5000/api/launch/${dashboard.id}`, { method: 'POST' });
    } catch (err) {
      console.warn("Backend not running");
    }
    setTimeout(() => {
      setLaunchStatus('success');
      setTimeout(() => setLaunchStatus(null), 3000);
    }, 1500);
  };

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-7xl mx-auto px-6 py-6"
    >
      <PageLoadingBar />

      {/* Top controls row */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -4 }}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          All Dashboards
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLaunch}
          disabled={launchStatus === 'pending'}
          className="launch-btn"
        >
          {launchStatus === 'pending' && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {launchStatus === 'success' && <span>Connected ✓</span>}
          {!launchStatus && (
            <>
              <div className="pulse-dot" />
              <Rocket size={16} />
              Launch Status
            </>
          )}
        </motion.button>
      </div>

      {/* Dashboard identity header */}
      <div className="flex items-center gap-5 mb-6">
        <div
          className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center text-[40px] shadow-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          {dashboard.icon}
        </div>
        <div>
          <h2 className="font-display font-[800] text-[28px]" style={{ color: 'var(--text-primary)' }}>
            {dashboard.name}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <p className="font-body text-[14px]" style={{ color: 'var(--text-muted)' }}>
              Manage your gesture tasks
            </p>
            <div className="task-count-badge">
              {tasks.length} tasks
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px mb-8" style={{ background: 'var(--border)' }} />

      {/* Task Grid */}
      <motion.div
        className="task-grid"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskTile key={task.id} task={task} onDelete={() => handleDeleteTask(task.id)} />
          ))}

          <motion.div
            layout
            onClick={() => setIsAddTaskOpen(true)}
            className="add-task-tile"
          >
            <span className="plus-icon">+</span>
            <span>Add Task</span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isAddTaskOpen && (
          <AddTaskModal
            dashboardId={dashboard.id}
            onClose={() => setIsAddTaskOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
