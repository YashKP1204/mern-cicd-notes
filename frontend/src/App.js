import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth here
import { ThemeProvider } from './context/ThemeContext';
import { NotesProvider } from './context/NotesContext';

import ProtectedRoute from './utils/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Archived from './pages/Archived';
import Analytics from './pages/Analytics';

// New component to handle routing *after* loading state is ready
const AppRoutes = () => {
  const { loading } = useAuth();

  // If the AuthContext is still checking localStorage, show a loading screen
  if (loading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archived"
          element={
            <ProtectedRoute>
              <Archived />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        {/* Wildcard route for 404s, redirects to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
};


function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider> {/* AuthProvider must wrap AppRoutes to provide context */}
          <NotesProvider>
            <AppRoutes /> {/* Render the routes component here */}
            
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </NotesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
