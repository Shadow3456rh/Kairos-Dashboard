import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import DashboardOverview from './DashboardOverview';
import DashboardDetail from './DashboardDetail';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);

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
      
      // Update selectedDashboard reference if it changed
      if (selectedDashboard) {
        const updated = data.find(d => d.id === selectedDashboard.id);
        if (updated) {
          setSelectedDashboard(updated);
        } else {
          setSelectedDashboard(null); // It was deleted
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser, selectedDashboard]);

  const deleteDashboard = async (dashboardId) => {
    if (!currentUser) return;
    try {
      const tasksRef = collection(db, "users", currentUser.uid, "dashboards", dashboardId, "tasks");
      const snapshot = await getDocs(tasksRef);
      const deletePromises = snapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "users", currentUser.uid, "dashboards", dashboardId));
    } catch (err) {
      console.error("Error deleting dashboard: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!selectedDashboard ? (
            <DashboardOverview 
              key="overview"
              dashboards={dashboards} 
              onSelectDashboard={setSelectedDashboard} 
              onDeleteDashboard={deleteDashboard} 
            />
          ) : (
            <DashboardDetail 
              key="detail"
              dashboard={selectedDashboard} 
              onBack={() => setSelectedDashboard(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
