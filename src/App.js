import React, { Suspense, lazy, useState, useEffect } from 'react';
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
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  if (showSplash) {
    return (
      <div className="global-loading-spinner" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{fontSize:48,fontWeight:900,letterSpacing:2,color:'#007bff',fontFamily:'Segoe UI, Arial, sans-serif',marginBottom:24,textShadow:'0 2px 12px #007bff33'}}>DRH</div>
          <svg width="48" height="48" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="#007bff" strokeWidth="5" strokeLinecap="round" strokeDasharray="31.4 31.4" strokeDashoffset="0">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <div style={{marginTop:16,fontSize:18,color:'#007bff',fontWeight:600,letterSpacing:1}}>Chargement...</div>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Suspense fallback={
        <div className="global-loading-spinner" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{fontSize:48,fontWeight:900,letterSpacing:2,color:'#007bff',fontFamily:'Segoe UI, Arial, sans-serif',marginBottom:24,textShadow:'0 2px 12px #007bff33'}}>DRH</div>
            <svg width="48" height="48" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#007bff" strokeWidth="5" strokeLinecap="round" strokeDasharray="31.4 31.4" strokeDashoffset="0">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <div style={{marginTop:16,fontSize:18,color:'#007bff',fontWeight:600,letterSpacing:1}}>Chargement...</div>
          </div>
        </div>
      }>
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
