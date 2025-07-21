import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TestimonialConfirmation from './components/TestimonialConfirmation';
import './i18n';

// Composant de Route Protégée
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Lazy loading des composants lourds
const MainLayout = lazy(() => import('./MainLayout')); // Création d'un layout principal
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="loading-spinner">Chargement...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/testimonialConfirmation" element={<TestimonialConfirmation />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
