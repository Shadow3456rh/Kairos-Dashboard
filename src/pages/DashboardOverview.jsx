import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import AddDashboardModal from '../components/AddDashboardModal';
import PageLoadingBar from '../components/PageLoadingBar';

export default function DashboardOverview({ dashboards, onSelectDashboard, onDeleteDashboard }) {
  const [isAddDashboardOpen, setIsAddDashboardOpen] = useState(false);

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-7xl mx-auto px-6 py-8"
    >
      <PageLoadingBar />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-[800]" style={{ color: 'var(--text-primary)' }}>
          Your Gesture Profiles
        </h1>
        <p className="font-body text-[15px] mt-1" style={{ color: 'var(--text-muted)' }}>
          Click a profile to manage its gesture tasks.
        </p>
      </div>

      {/* Empty State */}
      {dashboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-[64px] mb-4">🖐</div>
          <h2 className="font-display text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
            No profiles yet
          </h2>
          <p className="font-body text-[14px] mt-2 mb-6 max-w-sm" style={{ color: 'var(--text-muted)' }}>
            Create your first gesture profile to get started.
          </p>
          <button
            onClick={() => setIsAddDashboardOpen(true)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ background: 'var(--accent)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            + Create Profile
          </button>
        </div>
      ) : (
        <motion.div
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {}
          }}
        >
          <AnimatePresence>
            {dashboards.map((dash) => (
              <motion.div
                key={dash.id}
                layout
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                onClick={() => onSelectDashboard(dash)}
                className="group dashboard-card"
              >
                {/* Icon Pill */}
                <div className="card-icon-pill">
                  {dash.icon}
                </div>

                {/* Name */}
                <h3 className="card-name">{dash.name}</h3>

                {/* Badge */}
                <div className="task-count-badge">Manage Tasks</div>

                {/* Open hint on hover */}
                <div className="absolute bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
                  Open →
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDashboard(dash.id);
                  }}
                  className="absolute top-3 right-3 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-full"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--danger)';
                    e.currentTarget.style.background = 'var(--danger-soft)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}

            {/* New Dashboard Card */}
            <motion.div
              layout
              variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              onClick={() => setIsAddDashboardOpen(true)}
              className="new-dashboard-card"
            >
              <span className="plus">+</span>
              <span className="label">New Dashboard</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {isAddDashboardOpen && (
          <AddDashboardModal onClose={() => setIsAddDashboardOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
