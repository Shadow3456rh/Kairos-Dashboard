import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { Moon, Sun, MessageCircle } from "lucide-react";

// Protection Wrapper
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Toggle & Contact Us Buttons Helper
const FloatingControls = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <button
        onClick={toggleDarkMode}
        className="p-3 rounded-full bg-warm-white dark:bg-dark-surface shadow-warm dark:shadow-dark hover:shadow-warmHover dark:hover:shadow-darkHover transition-all text-warm-brown dark:text-dark-text group"
        title="Toggle Dark Mode"
      >
        {isDarkMode ? <Sun size={24} className="group-hover:text-warm-terracotta transition-colors" /> : <Moon size={24} className="group-hover:text-warm-terracotta transition-colors" />}
      </button>

      <button
        onClick={() => alert("Contact Us clicked!")}
        className="p-3 rounded-full bg-warm-white dark:bg-dark-surface shadow-warm dark:shadow-dark hover:shadow-warmHover dark:hover:shadow-darkHover transition-all text-warm-brown dark:text-dark-text group"
        title="Contact Us"
      >
        <MessageCircle size={24} className="group-hover:text-warm-terracotta transition-colors" />
      </button>
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-noise">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <FloatingControls />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
