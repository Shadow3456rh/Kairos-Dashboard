import React from 'react';
import { motion } from 'framer-motion';
import { TASK_GESTURE_RULES } from '../constants/predefinedTasks';

// Get a deterministic icon from task name or default to star
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
      exit={{ scale: 0.85, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      className="task-tile"
    >
      {/* Fixed header — never scrolls */}
      <div className="task-tile-header">
        <div className="task-icon-pill">{icon}</div>
        <span className="task-name truncate">{task.name}</span>
        <button className="task-delete-btn" onClick={onDelete}>×</button>
      </div>

      {/* Divider */}
      <div className="task-divider" />

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
          <div className="flex flex-col gap-2 pt-1 font-body text-[12.5px] text-[#5A5A72] leading-snug">
            {task.appUrl ? (
              <>
                <div className="flex items-start gap-2">
                  <div className="bullet" />
                  <span className="truncate" title={task.appUrl}>
                    Opens: <span className="font-mono text-[11px] bg-[#F7F8FA] px-1 py-0.5 rounded border border-[#E8E8F0]">{task.appUrl}</span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bullet" />
                  <span>Click Launch to activate</span>
                </div>
              </>
            ) : (
              <span className="text-[13px]">{task.description}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
