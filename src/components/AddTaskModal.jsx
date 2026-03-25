import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { X, Check } from 'lucide-react';
import { PREDEFINED_TASKS } from '../constants/predefinedTasks';

export default function AddTaskModal({ dashboardId, onClose }) {
  const { currentUser } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleSelectPredefined = (task) => {
    setSelectedTask(task);
    setIsCustom(false);
  };

  const handleSubmit = async () => {
    if (!selectedTask && !isCustom) return;
    if (isCustom && !customName.trim()) return;
    setLoading(true);
    try {
      const taskName = isCustom ? customName.trim() : selectedTask.name;
      const q = query(
        collection(db, "users", currentUser.uid, "dashboards", dashboardId, "tasks"),
        where("name", "==", taskName)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setToast('Task already exists!');
        setLoading(false);
        setTimeout(() => setToast(''), 2000);
        return;
      }
      const taskData = isCustom
        ? { name: taskName, appUrl: customUrl || "", description: customDesc || "", isDefault: false }
        : { name: taskName, appUrl: selectedTask.appUrl || "", description: selectedTask.description || "", isDefault: false };
      await addDoc(collection(db, "users", currentUser.uid, "dashboards", dashboardId, "tasks"), {
        ...taskData, createdAt: serverTimestamp()
      });
      setToast('Task added!');
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 16, opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, right: 40, zIndex: 300,
              background: toast.includes('exists') ? 'var(--danger)' : 'var(--success)',
              color: '#fff', padding: '10px 20px', borderRadius: 10,
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {toast.includes('exists') ? <X size={16} /> : <Check size={16} />}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

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

        <h2 className="modal-title">Add Task</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Choose a pre-defined task or create a custom one.
        </p>

        {/* Pre-defined task grid */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Pre-defined
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 240, overflowY: 'auto', paddingRight: 4 }}>
            {PREDEFINED_TASKS.map((task) => (
              <button
                key={task.name}
                onClick={() => handleSelectPredefined(task)}
                className={`predefined-task-card${selectedTask?.name === task.name && !isCustom ? ' selected' : ''}`}
                style={{ textAlign: 'left', width: '100%' }}
              >
                <div className="predefined-task-name">{task.name}</div>
                <div className="predefined-task-desc">{task.description}</div>
              </button>
            ))}

            {/* Custom option */}
            <button
              onClick={() => { setIsCustom(true); setSelectedTask(null); }}
              className={`predefined-task-card${isCustom ? ' selected' : ''}`}
              style={{ textAlign: 'left', width: '100%' }}
            >
              <div className="predefined-task-name">Custom Task</div>
              <div className="predefined-task-desc">Define your own action</div>
            </button>
          </div>
        </div>

        {/* Custom form */}
        <AnimatePresence>
          {isCustom && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4, paddingTop: 4 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Custom Details
                </p>
                <input type="text" placeholder="Task Name" value={customName} onChange={e => setCustomName(e.target.value)} className="modal-input" />
                <input type="text" placeholder="App URL (e.g. https://chrome.com)" value={customUrl} onChange={e => setCustomUrl(e.target.value)} className="modal-input" />
                <textarea placeholder="Short description (max 80 chars)" maxLength={80} value={customDesc} onChange={e => setCustomDesc(e.target.value)} className="modal-input" style={{ resize: 'none', height: 72 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="modal-save-btn"
          onClick={handleSubmit}
          disabled={loading || (!selectedTask && !isCustom) || (isCustom && !customName)}
        >
          {loading ? 'Saving…' : 'Save Task'}
        </button>
      </motion.div>
    </div>
  );
}
