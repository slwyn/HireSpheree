// Admin Session Management Service
// Handles admin authentication and session management

const ADMIN_SESSION_KEY = 'admin_session';
const ADMIN_SESSION_EXPIRY_KEY = 'admin_session_expiry';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

/**
 * Create an admin session after successful login
 * @param {string} username - Admin username
 * @returns {boolean} - True if session was created successfully
 */
export const createAdminSession = (username) => {
  try {
    const sessionData = {
      username: username,
      loginTime: new Date().toISOString(),
      isAdmin: true
    };
    
    const expiryTime = Date.now() + SESSION_DURATION;
    
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    sessionStorage.setItem(ADMIN_SESSION_EXPIRY_KEY, expiryTime.toString());
    
    console.log('Admin session created');
    return true;
  } catch (error) {
    console.error('Error creating admin session:', error);
    return false;
  }
};

/**
 * Check if admin session is valid
 * @returns {boolean} - True if session exists and is not expired
 */
export const isAdminSessionValid = () => {
  try {
    const sessionData = sessionStorage.getItem(ADMIN_SESSION_KEY);
    const expiryTime = sessionStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);
    
    if (!sessionData || !expiryTime) {
      return false;
    }
    
    // Check if session has expired
    const now = Date.now();
    const expiry = parseInt(expiryTime, 10);
    
    if (now > expiry) {
      // Session expired, clear it
      clearAdminSession();
      return false;
    }
    
    // Verify session data structure
    const session = JSON.parse(sessionData);
    if (!session.isAdmin || !session.username) {
      clearAdminSession();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating admin session:', error);
    clearAdminSession();
    return false;
  }
};

/**
 * Get current admin session data
 * @returns {Object|null} - Session data or null if no valid session
 */
export const getAdminSession = () => {
  if (!isAdminSessionValid()) {
    return null;
  }
  
  try {
    const sessionData = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error getting admin session:', error);
    return null;
  }
};

/**
 * Clear admin session (logout)
 */
export const clearAdminSession = () => {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
    // Also clear any other admin-related session data
    sessionStorage.removeItem('userInterfaceState');
    console.log('Admin session cleared');
  } catch (error) {
    console.error('Error clearing admin session:', error);
  }
};

/**
 * Extend admin session (refresh expiry time)
 * @returns {boolean} - True if session was extended
 */
export const extendAdminSession = () => {
  if (!isAdminSessionValid()) {
    return false;
  }
  
  try {
    const expiryTime = Date.now() + SESSION_DURATION;
    sessionStorage.setItem(ADMIN_SESSION_EXPIRY_KEY, expiryTime.toString());
    return true;
  } catch (error) {
    console.error('Error extending admin session:', error);
    return false;
  }
};

/**
 * Get remaining session time in milliseconds
 * @returns {number} - Remaining time or 0 if expired/invalid
 */
export const getSessionTimeRemaining = () => {
  try {
    const expiryTime = sessionStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);
    if (!expiryTime) {
      return 0;
    }
    
    const expiry = parseInt(expiryTime, 10);
    const remaining = expiry - Date.now();
    
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error('Error getting session time remaining:', error);
    return 0;
  }
};






