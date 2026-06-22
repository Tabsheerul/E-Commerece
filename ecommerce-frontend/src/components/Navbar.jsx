import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import AuthModal from './AuthModal';
import { AnimatePresence } from 'framer-motion';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text', 
  WebkitTextFillColor: 'transparent', 
  backgroundClip: 'text',
};

const Navbar = () => {
  const { totalItems, clearCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="fixed w-full z-50 top-0 transition-colors duration-500 backdrop-blur-xl bg-white/80 dark:bg-[#131318]/80 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20 relative">

          {/* ── Logo (Monochrome) ── */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black dark:text-white">
              Skin<span style={TEXT_GRADIENT} >Vault.</span>
            </Link>
          </div>

          {/* ── Center Links (Monochrome Active State) ── */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-10">
            {['Home', 'Shop', user && user.role === 'ADMIN' ? 'Admin' : null].filter(Boolean).map((item) => (
              <NavLink
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `transition-all duration-300 font-medium text-sm tracking-wide pb-1 ${
                    isActive
                      ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white border-b-2 border-transparent'
                  }`
                }
              >
                {item}
              </NavLink>
            ))}
          </div>

          {/* ── Right Side ── */}
          <div className="flex items-center space-x-5">
            
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 cursor-pointer rounded-full text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
              {theme === 'light' ? (
                <motion.svg initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
              ) : (
                <motion.svg initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </motion.svg>
              )}
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors relative p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Sign In / User Info */}
            {user ? (
              <div className="hidden md:flex items-center gap-4 pl-4 ml-2 border-l border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-500/20">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {user.username}
                  </span>
                </div>
                <button 
                  onClick={handleLogoutClick} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all duration-200 cursor-pointer"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="hidden md:block bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                Sign In
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>

    {/* Logout Confirmation Modal */}
    <AnimatePresence>
      {showLogoutConfirm && (
        <>
          <motion.div
            key="logout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelLogout}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              key="logout-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white dark:bg-[#131318] rounded-[2rem] shadow-2xl pointer-events-auto overflow-hidden border border-slate-200 dark:border-white/10 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 mx-auto mb-6 flex items-center justify-center text-red-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Log Out?</h3>
              <p className="text-slate-500 dark:text-white/40 mb-8 text-sm leading-relaxed">
                Are you sure you want to log out? Your cart will be securely saved for your next visit.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 py-3 rounded-full font-bold text-slate-600 dark:text-white/70 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>

    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;