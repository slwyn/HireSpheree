// Protected Route Component for Admin Pages
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAdminSessionValid } from '../../services/adminSessionService';

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAdminSessionValid()) {
        setIsAuthorized(true);
      } else {
        // Redirect to login with return path
        navigate('/admin-login', {
          replace: true,
          state: { 
            from: location.pathname,
            message: 'Please log in to access this page' 
          }
        });
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, location]);

  if (isChecking) {
    // Show loading state while checking
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect, so return nothing
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;






