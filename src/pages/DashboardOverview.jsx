import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import AddDashboardModal from '../components/AddDashboardModal';
import PageLoadingBar from '../components/PageLoadingBar';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export default function DashboardOverview({ dashboards, onSelectDashboard, onDeleteDashboard }) {
  const [isAddDashboardOpen, setIsAddDashboardOpen] = useState(false);

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <PageLoadingBar />

      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Gesture Profiles</h1>
        <p className="page-subtitle">Click a profile to manage its gesture tasks.</p>
      </div>

      {/* Empty State */}
      {dashboards.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '96px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🖐</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: 8 }}>
            No profiles yet
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 320 }}>
            Create your first gesture profile to get started.
          </p>
          <button
            onClick={() => setIsAddDashboardOpen(true)}
            className="auth-btn"
            style={{ width: 'auto', padding: '12px 28px' }}
          >
            + Create Profile
          </button>
        </div>
      ) : (
        <motion.div
          className="dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {dashboards.map((dash) => (
              <motion.div
                key={dash.id}
                layout
                variants={cardVariants}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectDashboard(dash)}
                className="dashboard-card"
              >
                {/* Delete */}
                <button
                  className="card-delete-btn"
                  onClick={(e) => { e.stopPropagation(); onDeleteDashboard(dash.id); }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>

                {/* Icon */}
                <div className="card-icon-wrap">{dash.icon}</div>

                {/* Name */}
                <h3 className="card-name">{dash.name}</h3>

                {/* Badge */}
                <div className="card-task-badge">Manage Tasks</div>
              </motion.div>
            ))}

            {/* New Dashboard Card */}
            <motion.div
              layout
              variants={cardVariants}
              onClick={() => setIsAddDashboardOpen(true)}
              className="new-dashboard-card"
            >
              <span className="nd-plus">+</span>
              <span className="nd-label">New Dashboard</span>
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
