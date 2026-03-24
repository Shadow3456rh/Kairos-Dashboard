import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { X, Check } from 'lucide-react';
import { PREDEFINED_TASKS } from '../constants/predefinedTasks';

export default function AddTaskModal({ dashboardId, onClose }) {
  const { currentUser } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCustom, setIsCustom] = useState(false);

  // Custom Task Fields
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

      // Uniqueness check
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
        ? {
          name: taskName,
          appUrl: customUrl || "",
          description: customDesc || "",
          isDefault: false
        }
        : {
          name: taskName,
          appUrl: selectedTask.appUrl || "",
          description: selectedTask.description || "",
          isDefault: false
        };

      await addDoc(collection(db, "users", currentUser.uid, "dashboards", dashboardId, "tasks"), {
        ...taskData,
        createdAt: serverTimestamp()
      });

      setToast('Task added successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 20, opacity: 1 }}
          className={`fixed top-0 right-10 ${toast.includes('exists') ? 'bg-[var(--danger)]' : 'bg-[var(--success)]'} text-white px-6 py-3 rounded-2xl shadow-[var(--shadow-md)] z-50 flex items-center gap-2`}
        >
          {toast.includes('exists') ? <X size={18} /> : <Check size={18} />} {toast}
        </motion.div>
      )}

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
        className="relative bg-[var(--bg-primary)] w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-[24px] p-8 shadow-[var(--shadow-lg)] border border-[var(--border-default)] scrollbar-hide"
      >
        <button
          onClick={onClose}
          className="sticky top-0 float-right p-2 bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors rounded-full hover:bg-[var(--danger)]/10 z-10"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-2xl font-bold mb-6 text-[var(--text-primary)] mt-2">Add New Task</h2>

        {/* Section 1: Predefined */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 text-[var(--text-secondary)]">Pre-defined Tasks</h3>
          <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto p-1 pr-2">
            {PREDEFINED_TASKS.map((task) => (
              <button
                key={task.name}
                onClick={() => handleSelectPredefined(task)}
                className={`p-3 rounded-xl border text-left flex flex-col transition-all
                  ${selectedTask?.name === task.name && !isCustom ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)] shadow-sm' : 'border-[var(--border-default)] hover:border-[var(--accent-secondary)]'}`}
              >
                <span className="font-bold text-sm text-[var(--text-primary)]">{task.name}</span>
                <span className="text-xs text-[var(--text-secondary)] truncate w-full">{task.description}</span>
              </button>
            ))}

            {/* Custom Option */}
            <button
              onClick={() => { setIsCustom(true); setSelectedTask(null); }}
              className={`p-3 rounded-xl border text-left flex flex-col transition-all
                ${isCustom ? 'border-[var(--accent-primary)] bg-[var(--accent-glow)] shadow-sm' : 'border-[var(--border-default)] hover:border-[var(--accent-secondary)]'}`}
            >
              <span className="font-bold text-sm text-[var(--text-primary)]">Custom Task</span>
              <span className="text-xs text-[var(--text-secondary)]">Define your own action</span>
            </button>
          </div>
        </div>

        {/* Section 2: Custom Form */}
        {isCustom && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-[var(--text-secondary)] pt-2 border-t border-[var(--border-default)]">Custom Task Details</h3>
            <input
              type="text"
              placeholder="Task Name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:outline-none focus:border-[var(--accent-primary)] text-sm text-[var(--text-primary)]"
            />
            <input
              type="text"
              placeholder="App URL or internal Path (e.g. https://chrome.com)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:outline-none focus:border-[var(--accent-primary)] text-sm text-[var(--text-primary)]"
            />
            <textarea
              placeholder="Short Description (max 80 chars)"
              maxLength={80}
              value={customDesc}
              onChange={(e) => setCustomDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:outline-none focus:border-[var(--accent-primary)] text-sm resize-none h-20 text-[var(--text-primary)]"
            />
          </motion.div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || (!selectedTask && !isCustom) || (isCustom && !customName)}
          className="w-full py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white rounded-2xl font-body font-medium transition-all hover:shadow-[var(--shadow-accent)] disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </motion.div>
    </div>
  );
}
