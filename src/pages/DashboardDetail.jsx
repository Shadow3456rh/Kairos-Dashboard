import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Rocket } from 'lucide-react';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
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
    // Use dashboard.id (stable primitive) instead of the full object to avoid
    // re-subscribing the listener on every parent re-render.
  }, [currentUser, dashboard?.id]);

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <PageLoadingBar />

      {/* Top controls row */}
      <div className="detail-topbar">
        <motion.button onClick={onBack} className="back-btn">
          <motion.span whileHover={{ x: -3 }} style={{ display: 'inline-flex' }}>
            <ArrowLeft size={15} />
          </motion.span>
          All Dashboards
        </motion.button>

        <button
          className="launch-btn"
          onClick={handleLaunch}
          disabled={launchStatus === 'pending'}
        >
          {launchStatus === 'pending' && (
            <span className="w-4 h-4 border-2 border-black/20 border-t-black/70 rounded-full animate-spin" style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: 'rgba(0,0,0,0.7)', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          )}
          {launchStatus === 'success' && <span>Connected ✓</span>}
          {!launchStatus && (
            <>
              <span className="launch-dot" />
              <Rocket size={14} />
              Launch Status
            </>
          )}
        </button>
      </div>

      {/* Dashboard identity header */}
      <div className="detail-header">
        <div className="detail-icon-wrap">{dashboard.icon}</div>
        <div>
          <h2 className="detail-title">{dashboard.name}</h2>
          <div className="detail-subtitle">
            <span>Gesture tasks</span>
            <span className="detail-badge">{tasks.length} tasks</span>
          </div>
        </div>
      </div>

      <div className="detail-divider" />

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
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500 }}>Add Task</span>
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
