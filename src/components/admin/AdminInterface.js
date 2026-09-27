import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserApplications from "./UserApplications";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAdminSessionValid,
  clearAdminSession,
  extendAdminSession,
  getSessionTimeRemaining,
} from "../../services/adminSessionService";
import { faUserSecret, faSignOut } from "@fortawesome/free-solid-svg-icons";
import AdminJobListings from "./AdminJobListings";
import TrashBin from "./TrashBin";
import AdminSidebar from "./AdminSidebar";
import FeedbackReports from "./FeedbackReports";

const AdminInterface = () => {
  const [view, setView] = useState("applications");
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const navigate = useNavigate();

  // Check admin session on mount and protect route
  useEffect(() => {
    if (!isAdminSessionValid()) {
      // No valid session, redirect to login
      clearAdminSession();
      navigate('/admin-login', { 
        replace: true,
        state: { message: 'Please log in to access the admin dashboard' }
      });
      return;
    }

    // Restore saved state
    const savedState = sessionStorage.getItem("userInterfaceState");
    if (savedState) {
      const { view, activeMenuIndex } = JSON.parse(savedState);
      setView(view);
      setActiveMenuIndex(activeMenuIndex);
    }

    // Set up session monitoring
    const checkSessionInterval = setInterval(() => {
      if (!isAdminSessionValid()) {
        clearAdminSession();
        navigate('/admin-login', { 
          replace: true,
          state: { message: 'Your session has expired. Please log in again.' }
        });
      } else {
        // Extend session on activity (every 30 minutes)
        extendAdminSession();
        
        // Warn if session is expiring soon (less than 30 minutes remaining)
        const timeRemaining = getSessionTimeRemaining();
        if (timeRemaining > 0 && timeRemaining < 30 * 60 * 1000) {
          setSessionExpiring(true);
        } else {
          setSessionExpiring(false);
        }
      }
    }, 60000); // Check every minute

    // Extend session on user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      extendAdminSession();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(checkSessionInterval);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate]);

  useEffect(() => {
    const stateToSave = { view, activeMenuIndex };
    sessionStorage.setItem("userInterfaceState", JSON.stringify(stateToSave));
  }, [view, activeMenuIndex]);

  const openModalHandler = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin-login", { replace: true });
  };

  const handleMenuClick = (index, action) => {
    setActiveMenuIndex(index);
    setView(action);
  };

  const handleMenuAction = (action) => {
    if (action === "logout") {
      openModalHandler();
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}
      ></div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        <div className="flex flex-1 lg:ml-0">
          {/* SIDEBAR */}
          <AdminSidebar
            open={open}
            setOpen={setOpen}
            activeMenuIndex={activeMenuIndex}
            onMenuClick={handleMenuClick}
            onLogoutClick={() => handleMenuAction("logout")}
          />

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col lg:ml-0">
            {/* TOP NAVBAR */}
            <nav className="w-full px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg sticky top-0 z-30 lg:z-20">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {open ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUserSecret} className="text-blue-300 text-lg sm:text-xl" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white truncate">Admin Dashboard</h1>
                  <p className="text-white/60 text-xs hidden sm:block">Manage your foundation</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/20 rounded-lg border border-blue-400/30">
                  <FontAwesomeIcon icon={faUserSecret} className="text-blue-300" />
                  <span className="text-sm text-white font-semibold">Admin</span>
                </div>
              </div>
            </nav>

            {/* SESSION WARNING */}
            {sessionExpiring && (
              <div className="mx-4 sm:mx-6 md:mx-10 mt-4 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm flex items-start sm:items-center justify-between gap-2">
                <span className="flex-1">⚠️ Your session will expire soon. Your activity will extend the session.</span>
                <button
                  onClick={() => setSessionExpiring(false)}
                  className="text-yellow-300 hover:text-yellow-100 flex-shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            )}

            {/* CONTENT AREA */}
            <div className="flex-1 p-4 sm:p-6 md:p-8">
              {view === "applications" ? (
                <UserApplications />
              ) : view === "jobs" ? (
                <AdminJobListings />
              ) : view === "archive" ? (
                <TrashBin />
              ) : view === "feedback" ? (
                <FeedbackReports />
              ) : (
                <div className="text-center py-20">
                  <p className="text-white/70 text-lg">Error loading content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl text-center w-full max-w-md">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faSignOut} className="text-red-300 text-xl sm:text-2xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Confirm Logout</h2>
            <p className="text-white/70 mb-6 sm:mb-8 text-sm sm:text-base">Are you sure you want to log out? This action will end your admin session.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-2.5 sm:py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  closeModal();
                }}
                className="flex-1 px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterface;

