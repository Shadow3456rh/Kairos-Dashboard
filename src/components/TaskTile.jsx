import React from 'react';
import { motion } from 'framer-motion';
import { TASK_GESTURE_RULES } from '../constants/predefinedTasks';

const getTaskIcon = (name) => {
  if (name.includes('Media')) return '🎵';
  if (name.includes('Mouse')) return '🖱️';
  if (name.includes('Reader')) return '📖';
  if (name.includes('Camera')) return '📸';
  if (name.includes('Environment')) return '🌡️';
  if (name.includes('Slides')) return '📊';
  if (name.includes('Chrome') || name.includes('Brave')) return '🌐';
  if (name.includes('File') || name.includes('Gallery')) return '📁';
  if (name.includes('WhatsApp')) return '💬';
  return '✨';
};

export default function TaskTile({ task, onDelete }) {
  const rules = TASK_GESTURE_RULES[task.name];
  const icon = getTaskIcon(task.name);

  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="task-tile"
    >
      {/* Fixed header */}
      <div className="task-tile-header">
        <div className="task-icon-pill">{icon}</div>
        <span className="task-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.name}
        </span>
        <button className="task-delete-btn" onClick={onDelete}>×</button>
      </div>

      {/* Scrollable bullet area */}
      <div className="task-rules-scroll">
        {rules ? (
          rules.map((rule, idx) => (
            <div key={idx} className="task-rule-item">
              <span className="bullet" />
              <span>{rule}</span>
            </div>
          ))
        ) : (
          <div className="task-rule-item" style={{ flexDirection: 'column', gap: 6 }}>
            {task.appUrl ? (
              <>
                <div className="task-rule-item">
                  <span className="bullet" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Opens: <span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg-elevated)', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border)' }}>{task.appUrl}</span>
                  </span>
                </div>
                <div className="task-rule-item">
                  <span className="bullet" />
                  <span>Click Launch to activate</span>
                </div>
              </>
            ) : (
              <div className="task-rule-item">
                <span className="bullet" />
                <span>{task.description}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
