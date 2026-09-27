import React, { useState, useEffect } from 'react';
import { faArrowLeft, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@material-tailwind/react";
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/hiresphere.png";
import { createAdminSession, isAdminSessionValid } from '../../services/adminSessionService';

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm();

  const ADMIN_USERNAME = 'admin-01-management';
  const ADMIN_PASSWORD = 'admin';

  const [loginError, setLoginError] = useState('');
  const location = useLocation();

  // Check if already logged in and show redirect messages
  useEffect(() => {
    if (isAdminSessionValid()) {
      // Already logged in, redirect to admin interface
      const returnPath = location.state?.from || '/admin-interface';
      navigate(returnPath, { replace: true });
    } else if (location.state?.message) {
      // Show message from redirect (e.g., session expired)
      setLoginError(location.state.message);
    }
  }, [navigate, location]);

  const onSubmit = (data) => {
    setLoading(true);
    setLoginError('');
    
    if (data.username === ADMIN_USERNAME && data.password === ADMIN_PASSWORD) {
      // Create admin session
      const sessionCreated = createAdminSession(data.username);
      
      if (sessionCreated) {
        setTimeout(() => {
          setLoading(false);
          navigate('/admin-interface');
        }, 800);
      } else {
        setLoading(false);
        setLoginError('Failed to create session. Please try again.');
      }
    } else {
      setLoading(false);
      setLoginError('Invalid username or password. Please try again.');
    }
  };


  const getBorderColor = (field) => (errors[field] ? 'border-red-400' : 'border-white/20');

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* BACKGROUND LAYER */}
      <div 
        className="absolute inset-0 z-0 fixed" 
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)',
          height: '100%',
          width: '100%'
        }}
      ></div>

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col flex-grow w-full">

        {/* MAIN CONTENT */}
        <main className="flex-1 flex justify-center items-center py-12 px-6">
          {/* Main Card Container */}
          <div className="w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/10">
            {/* LEFT PANEL (Login Form) */}
            <div className="w-full md:w-1/2 p-8 md:p-12 bg-white/10 backdrop-blur-md border-r border-white/10">
              <div className="mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faUserSecret} className="text-blue-300 text-2xl" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-white tracking-wide">Admin Login</h2>
                <p className="text-white/70 text-sm">Access the admin dashboard</p>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="block text-xs font-bold mb-2 text-white/80 uppercase tracking-wider">Username</label>
                  <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Username is required.', minLength: { value: 4, message: 'Minimum of 4 characters.' } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter your username"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border ${getBorderColor('username')} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all`}
                      />
                    )}
                  />
                  {errors.username && <span className="text-red-400 text-xs mt-1 block">{errors.username.message}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2 text-white/80 uppercase tracking-wider">Password</label>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Password is required.', minLength: { value: 4, message: 'Minimum of 4 characters.' } }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white border ${getBorderColor('password')} placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all`}
                      />
                    )}
                  />
                  {errors.password && <span className="text-red-400 text-xs mt-1 block">{errors.password.message}</span>}
                </div>

                {loginError && (
                  <div className="bg-red-500/20 border border-red-400/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wider py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2 ${
                    loading ? "cursor-not-allowed opacity-75" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>LOGGING IN...</span>
                    </>
                  ) : (
                    "LOGIN"
                  )}
                </button>

                <p className="text-center text-white/60 text-sm pt-4">Use your admin credentials to access the dashboard.</p>
              </form>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 relative bg-white/10 backdrop-blur-md flex justify-center items-center overflow-hidden py-12 md:py-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20"></div>
              <img src={logo} alt="HireSphere Logo" className="absolute w-96 opacity-10 rotate-5" />
              <div className="relative text-white text-center px-6 z-10">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faUserSecret} className="w-10 h-10 text-blue-300" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg leading-tight">
                  Admin Portal
                </h2>
                <div className="h-1 w-16 bg-blue-400/50 mx-auto mb-4 rounded-full"></div>
                <p className="text-white/80 text-sm max-w-sm mx-auto leading-relaxed">
                  Manage listings, users and applications for the HireSphere.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLogin;
