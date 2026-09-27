import './index.css';
import About from './components/pages/About';
import JobApplicationModal from './components/pages/JobApplicationModal';

import { AuthProvider } from './AuthContext';
import EmailSent from './components/auth/EmailSent';
import HomeScreen from './components/pages/index';
import JobListings from './components/pages/JobListings';
import ContactInfo from './components/pages/ContactInfo';
import NewPassword from './components/auth/NewPassword';
import React, { useEffect, useState } from 'react';
import ForgotPassword from './components/auth/ForgotPassword';
import { ThemeProvider } from '@material-tailwind/react';
import ChangedPassword from './components/auth/ChangedPassword';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// Admin imports
import AdminInterface from './components/admin/AdminInterface';
import AdminLogin from './components/admin/AdminLogin';
import TrashBin from './components/admin/TrashBin';
import ApplicationInfo from './components/admin/ApplicationInfo';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

// User imports
// import UserVerification from './components/user/UserVerification'; // Removed - no longer needed


const AnimatedRoutes = () => {
  const location = useLocation();
  const [animClass, setAnimClass] = useState('route-enter-active');
  const [currentLocation, setCurrentLocation] = useState(location);

  const TRANSITION_MS = 250;

  useEffect(() => {
    if (location.pathname === currentLocation.pathname) return;
    setAnimClass('route-exit-active');

    const timeout = setTimeout(() => {
      setCurrentLocation(location);

      setAnimClass('route-enter');
  
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimClass('route-enter-active'));
      });
    }, TRANSITION_MS);

    return () => clearTimeout(timeout);
  }, [location, currentLocation]);

  // Hide navbar on user-interface, admin-interface, and application-info pages
  const hideNavbar = location.pathname === '/user-interface' || 
                     location.pathname === '/admin-interface' || 
                     location.pathname.startsWith('/application-info/');

  return (
    <>
      <div className="background-container fixed inset-0 -z-10"></div>
      {!hideNavbar && <Navbar />}
      <div className={`route-wrapper ${animClass}`}>
        <Routes location={currentLocation}>
          <Route path='/' element= {<HomeScreen/>}/>
          <Route path='/about' element= {<About/>}/>
          <Route 
            path="/trash-bin" 
            element={
              <ProtectedAdminRoute>
                <TrashBin />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="/email-sent" element={<EmailSent />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/job-listings" element={<JobListings />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/admin-interface" 
            element={
              <ProtectedAdminRoute>
                <AdminInterface />
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/application-info/:unique_id" 
            element={
              <ProtectedAdminRoute>
                <ApplicationInfo />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="/changed-password" element={<ChangedPassword />} />
          <Route path="/new-password/:token/:email" element={<NewPassword />} />
          <Route path="/job-application" element={<JobApplicationModal />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  
        <AnimatedRoutes />
   
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
};


export default App;
