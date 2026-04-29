import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import WidgetMetrics from './pages/WidgetMetrics';
import './App.css';

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setPage('dashboard');
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('landing');
  };

  const handleNavigateToLogin = () => {
    setPage('login');
  };

  const handleNavigateToRegister = () => {
    setPage('register');
  };

  const handleShowBusinessProfile = () => {
    setPage('business-profile');
  };

  const handleBackFromBusinessProfile = () => {
    setPage('dashboard');
  };

  const handleShowMetrics = () => {
    setPage('widget-metrics');
  };

  const handleBackFromMetrics = () => {
    setPage('dashboard');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {page === 'landing' && (
        <Landing 
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToRegister={handleNavigateToRegister}
        />
      )}
      {page === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
      {page === 'register' && (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}
      {page === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onShowBusinessProfile={handleShowBusinessProfile}
          onShowMetrics={handleShowMetrics}
        />
      )}
      {page === 'business-profile' && user && (
        <BusinessProfile 
          user={user}
          onBack={handleBackFromBusinessProfile}
        />
      )}
      {page === 'widget-metrics' && user && (
        <WidgetMetrics 
          user={user}
          onBack={handleBackFromMetrics}
        />
      )}

      {page === 'login' && (
        <div className="page-switcher">
          <button onClick={() => setPage('register')}>Go to Register</button>
          <button onClick={() => setPage('landing')}>Back to Home</button>
        </div>
      )}
      {page === 'register' && (
        <div className="page-switcher">
          <button onClick={() => setPage('login')}>Go to Login</button>
          <button onClick={() => setPage('landing')}>Back to Home</button>
        </div>
      )}
    </div>
  );
}
