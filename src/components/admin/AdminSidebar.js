import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faCalendarDays,
  faSignOut,
  faBriefcase,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/hiresphere.png";

const Menus = [
  { title: "Applications", icon: faAddressBook, gap: true, action: "applications" },
  { title: "Job Listings", icon: faBriefcase, action: "jobs" },
  { title: "Archive", icon: faCalendarDays, action: "archive" },
  { title: "Feedback / Suggestion", icon: faCommentDots, action: "feedback" },
  { title: "Logout", icon: faSignOut, action: "logout" },
];

const AdminSidebar = ({
  open,
  setOpen,
  activeMenuIndex,
  onMenuClick,
  onLogoutClick,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay - Only show when sidebar is open on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${open ? 'fixed lg:sticky' : 'sticky lg:sticky'} top-0 left-0 ${open ? 'z-50' : 'z-50 lg:z-auto'} h-screen transition-all duration-300 ease-in-out lg:transition-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${open ? "w-72" : "w-0 lg:w-20"} bg-blue-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col ${open ? '' : 'lg:self-start'} flex-shrink-0 overflow-hidden`}
        onMouseEnter={() => !window.matchMedia("(max-width: 1024px)").matches && setOpen(true)}
        onMouseLeave={() => !window.matchMedia("(max-width: 1024px)").matches && setOpen(false)}
      >
        {/* Header - Fixed at top */}
        <div className="flex items-center mb-6 sm:mb-8 p-4 flex-shrink-0">
          <img
            src={logo}
            alt="HireSphere Logo"
            className={`h-10 w-10 sm:h-12 sm:w-12 object-contain cursor-pointer duration-500 ${!open && "rotate-[360deg]"}`}
            onClick={() => navigate("/")}
          />
          <h1
            className={`text-white origin-left font-bold text-base sm:text-xl ml-3 duration-300 ${
              !open && "scale-0 opacity-0"
            }`}
          >
            HIRESPHERE
          </h1>
        </div>

        {/* Menu - Scrollable */}
        <ul className="mt-0 sm:mt-0 px-4 pb-4 flex-1 overflow-y-auto">
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`flex items-center text-white/90 text-sm sm:text-base gap-x-3 sm:gap-x-4 p-2.5 sm:p-3 px-3 sm:px-4 hover:bg-white/10 cursor-pointer rounded-lg duration-200 mb-2
                ${menu.gap ? "mt-4 sm:mt-6" : ""} ${
                index === activeMenuIndex && "bg-white/20 border-l-4 border-blue-400"
              }`}
              onClick={() => {
                if (menu.action === "logout") {
                  onLogoutClick();
                } else {
                  onMenuClick(index, menu.action);
                  // Close sidebar on mobile after selection
                  if (window.matchMedia("(max-width: 1024px)").matches) {
                    setOpen(false);
                  }
                }
              }}
            >
              <div className="text-blue-300 flex-shrink-0">
                <FontAwesomeIcon icon={menu.icon} className="text-base sm:text-lg" />
              </div>
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-300 font-semibold whitespace-nowrap`}
              >
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;


