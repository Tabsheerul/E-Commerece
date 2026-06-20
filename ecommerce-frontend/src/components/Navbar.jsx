import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import AuthModal from './AuthModal';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text', 
  WebkitTextFillColor: 'transparent', 
  backgroundClip: 'text',
};

const Navbar = () => {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 transition-colors duration-500 backdrop-blur-xl bg-white/80 dark:bg-[#131318]/80 border-b border-gray-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">

          {/* ── Logo (Monochrome) ── */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black dark:text-white">
              Skin<span style={TEXT_GRADIENT} >Vault.</span>
            </Link>
          </div>

          {/* ── Center Links (Monochrome Active State) ── */}
          <div className="hidden md:flex space-x-10">
            {['Home', 'Shop', 'Admin'].map((item) => (
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
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm font-medium dark:text-white">Hello, {user.username}</span>
                <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                  Logout
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
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};

export default Navbar;