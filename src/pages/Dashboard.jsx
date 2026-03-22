import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import AddDashboardModal from '../components/AddDashboardModal';
import AddTaskModal from '../components/AddTaskModal';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [isAddDashboardOpen, setIsAddDashboardOpen] = useState(false);
  const [activeDashboardForTask, setActiveDashboardForTask] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "users", currentUser.uid, "dashboards"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDashboards(data);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const deleteDashboard = async (dashboardId) => {
    if(!currentUser) return;
    try {
      // Delete tasks subcollection first
      const tasksRef = collection(db, "users", currentUser.uid, "dashboards", dashboardId, "tasks");
      const snapshot = await getDocs(tasksRef);
      const deletePromises = snapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
      await Promise.all(deletePromises);
      
      // Delete dashboard document
      await deleteDoc(doc(db, "users", currentUser.uid, "dashboards", dashboardId));
    } catch (err) {
      console.error("Error deleting dashboard: ", err);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warm-white dark:bg-dark-surface rounded-xl shadow-sm flex items-center justify-center border border-warm-beige dark:border-dark-border">
            <span className="text-xl">🖐</span>
          </div>
          <h1 className="font-display text-2xl text-warm-brown dark:text-dark-text">GestureHub</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-warm-white dark:bg-dark-surface rounded-2xl shadow-sm border border-warm-beige dark:border-dark-border">
            <div className="w-8 h-8 rounded-full bg-warm-terracotta/20 flex items-center justify-center text-warm-terracotta font-medium">
              {currentUser?.displayName?.[0] || currentUser?.email?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-warm-brown dark:text-dark-text">
              {currentUser?.displayName || currentUser?.email?.split('@')[0]}
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-3 text-warm-muted hover:text-warm-red dark:text-dark-muted dark:hover:text-warm-red transition-colors bg-warm-white dark:bg-dark-surface rounded-xl shadow-sm border border-warm-beige dark:border-dark-border"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Dashboard Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <AnimatePresence>
          {dashboards.map((dashboard) => (
            <ProfileCard 
              key={dashboard.id} 
              dashboard={dashboard} 
              onDelete={() => deleteDashboard(dashboard.id)}
              onAddTask={() => setActiveDashboardForTask(dashboard.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Dashboard Button */}
      <motion.button
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsAddDashboardOpen(true)}
        className="w-full mt-8 py-6 rounded-3xl border-2 border-dashed border-warm-terracotta/40 dark:border-warm-terracotta/30 text-warm-terracotta dark:text-warm-terracotta hover:bg-warm-terracotta/5 dark:hover:bg-warm-terracotta/10 transition-colors flex items-center justify-center gap-3 font-medium text-lg"
      >
        <Plus size={24} /> Add New Dashboard
      </motion.button>

      {/* Modals */}
      <AnimatePresence>
        {isAddDashboardOpen && (
          <AddDashboardModal onClose={() => setIsAddDashboardOpen(false)} />
        )}
        {activeDashboardForTask && (
          <AddTaskModal 
            dashboardId={activeDashboardForTask} 
            onClose={() => setActiveDashboardForTask(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
