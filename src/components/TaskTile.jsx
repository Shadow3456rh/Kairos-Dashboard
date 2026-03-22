import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function TaskTile({ task, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      className="group relative bg-[#FAFAFA] dark:bg-[#2A2A2A] rounded-2xl p-4 border border-warm-beige/50 dark:border-dark-border/50 shadow-sm flex flex-col justify-center h-[100px] overflow-hidden transition-all hover:border-l-4 hover:border-l-warm-terracotta"
    >
      <div className="flex items-start justify-between mb-1">
        <h4 className="font-body font-bold text-sm text-warm-brown dark:text-dark-text truncate pr-4">
          {task.name}
        </h4>
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 p-1 text-warm-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-warm-red dark:text-dark-muted dark:hover:text-warm-red rounded-full hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X size={14} />
        </button>
      </div>
      <p className="text-xs text-warm-muted dark:text-dark-muted line-clamp-2 leading-tight">
        {task.description}
      </p>
      {task.appUrl && (
        <span className="text-[10px] text-warm-sand mt-1 truncate">
          {task.appUrl}
        </span>
      )}
    </motion.div>
  );
}
