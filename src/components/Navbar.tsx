
import React, { useState } from "react";
import { Home, LayoutList, User, Upload, LogIn, LogOut, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { useAuth } from "@/hooks/useAuth";
import Logo from "./Logo";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Storyboard", path: "/storyboard", icon: LayoutList },
  { name: "Publish", path: "/publish", icon: Upload },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="w-full bg-white/70 border-b border-slate-200 py-2 px-2 md:px-6 shadow-sm fixed top-0 left-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition min-w-fit">
          <Logo size={32} />
          <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 whitespace-nowrap select-none">
            Mind<span className="text-slate-600">Canvas</span>
          </span>
        </Link>
        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-3 flex-1 justify-center">
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-base font-medium transition-all ${
                    active
                      ? "bg-blue-100 text-blue-700 shadow"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Mobile: Hamburger menu */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Menu size={26} />
          </button>
        </div>
        {/* Profile/Actions */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          {!loading && !user && (
            <Link to="/auth" className="flex gap-1 items-center px-3 py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium text-sm">
              <LogIn size={18} className="mr-1" /> Log in
            </Link>
          )}
          {!loading && user && (
            <>
              <Link to="/profile" className="flex items-center gap-1 px-2 py-1 hover:bg-fuchsia-50 rounded transition text-slate-700">
                <ProfileAvatar />
                <span className="hidden md:inline text-slate-800 font-semibold text-base ml-1">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 hover:bg-fuchsia-100 text-blue-700 font-semibold text-sm border border-blue-200 shadow transition-all ml-1"
                aria-label="Log out"
              >
                <LogOut size={16} /> <span className="hidden md:inline">Log out</span>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute left-0 top-full w-full shadow-lg z-50 bg-white border-b border-blue-100 animate-fade-in">
          <ul className="flex flex-col py-2 px-4 gap-1">
            {navItems.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-slate-200 mt-2 pt-2 flex flex-col gap-1">
              {!loading && !user && (
                <Link to="/auth" className="flex items-center gap-2 px-3 py-2 rounded-lg text-blue-700 font-medium hover:bg-blue-50" onClick={() => setMenuOpen(false)}>
                  <LogIn size={18} /> Log in
                </Link>
              )}
              {!loading && user && (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-2 px-2 py-2 hover:bg-fuchsia-50 rounded transition text-slate-700" onClick={() => setMenuOpen(false)}>
                    <ProfileAvatar />
                    <span className="text-base font-semibold">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-fuchsia-100 text-blue-700 font-semibold"
                    aria-label="Log out"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
