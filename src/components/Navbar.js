import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/hiresphere.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const navItems = [
    { path: "/", label: "HOME" },
    { path: "/job-listings", label: "JOB LISTINGS" },
    { path: "/about", label: "ABOUT US" },
    { path: "/contact-info", label: "CONTACT US" },
  ];

  return (
    <header className="
      sticky top-0 z-50 
      bg-blue-900/40 
      backdrop-blur-xl 
      border-b border-white/10 
      shadow-lg 
      transition-all duration-500
    ">
      <div className="flex items-center justify-between px-6 py-4">
        {/* LEFT SIDE: Logo and Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => go("/")}
        >
          <img 
            src={logo} 
            alt="HireSphere" 
            className="h-10 w-10 md:h-12 md:w-12 object-contain" 
          />
          <h1 className="text-white text-xl md:text-2xl font-extrabold tracking-widest">
            HIRESPHERE
          </h1>
        </div>

        {/* MIDDLE: Navigation Menu (Desktop) */}
        <nav className="hidden md:flex items-center">
          <ul className="flex items-center gap-6 text-white tracking-widest text-sm font-semibold">
            {navItems.map((item) => (
              <li 
                key={item.path}
                onClick={() => go(item.path)} 
                className={`cursor-pointer hover:text-blue-300 transition-colors ${
                  location.pathname === item.path ? 'text-blue-300' : ''
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* RIGHT SIDE: Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 hover:text-blue-300 transition-colors"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION MENU */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-blue-900/50 backdrop-blur-xl">
          <ul className="flex flex-col px-6 py-4 gap-4 text-white tracking-widest text-sm font-semibold">
            {navItems.map((item) => (
              <li 
                key={item.path}
                onClick={() => go(item.path)} 
                className={`cursor-pointer hover:text-blue-300 transition-colors py-2 ${
                  location.pathname === item.path ? 'text-blue-300' : ''
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;

