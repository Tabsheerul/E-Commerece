import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [accountType, setAccountType] = useState('user'); // 'user' or 'admin'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useContext(AuthContext);

    // Reset state when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setAccountType('user');
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            setAdminCode('');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, initialMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Form Validation
        if (mode === 'register') {
            if (name.trim().length < 2) {
                setError('Please enter a valid full name.');
                return;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address (e.g., user@example.com).');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (mode === 'register' && accountType === 'admin') {
            if (adminCode.trim() === '') {
                setError('Admin Secret Code is required for admin accounts.');
                return;
            }
        }

        setIsLoading(true);

        try {
            if (mode === 'login') {
                const result = await login(email, password);
                if (result.success) {
                    onClose();
                } else {
                    setError(result.message || 'Login failed');
                }
            } else {
                const result = await register(name, email, password, accountType === 'admin' ? adminCode : undefined);
                if (result.success) {
                    setMode('login');
                    setError('');
                } else {
                    setError(result.message || 'Registration failed');
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]"
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-md bg-white/90 dark:bg-[#131318]/90 backdrop-blur-2xl rounded-2xl shadow-2xl pointer-events-auto overflow-hidden border border-gray-200 dark:border-white/10"
                        >
                            {/* Close button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="p-8">
                                <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2 tracking-tight">
                                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                                    {mode === 'login' 
                                        ? 'Enter your details to access your account.' 
                                        : 'Join us to get the best premium skins.'}
                                </p>

                                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg mb-6">
                                    <button 
                                        type="button"
                                        onClick={() => setAccountType('user')}
                                        className={`flex-1 text-sm font-semibold py-2 rounded-md transition-all ${accountType === 'user' ? 'bg-white dark:bg-[#131318] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        Customer
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setAccountType('admin')}
                                        className={`flex-1 text-sm font-semibold py-2 rounded-md transition-all ${accountType === 'admin' ? 'bg-white dark:bg-[#131318] shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        Admin
                                    </button>
                                </div>

                                <motion.form layout onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div 
                                                layout
                                                initial={{ opacity: 0, y: -10, height: 0 }} 
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: -10, height: 0 }}
                                                className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-500/20 text-center"
                                            >
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {mode === 'register' && (
                                            <motion.div
                                                layout
                                                key="register-name-field"
                                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                animate={{ opacity: 1, height: 'auto', transitionEnd: { overflow: 'visible' } }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 mt-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {mode === 'register' && accountType === 'admin' && (
                                            <motion.div
                                                layout
                                                key="register-admin-code"
                                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                animate={{ opacity: 1, height: 'auto', transitionEnd: { overflow: 'visible' } }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 mt-1">Admin Secret Code</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={adminCode}
                                                    onChange={(e) => setAdminCode(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                                    placeholder="SECRET_ADMIN_123"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.div layout>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </motion.div>

                                    <motion.div layout>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                    </motion.div>

                                    <motion.button
                                        layout
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isLoading}
                                        type="submit"
                                        className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide shadow-lg shadow-violet-500/30 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-[#131318] mt-2"
                                    >
                                        {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                                    </motion.button>
                                </motion.form>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                        <button 
                                            onClick={toggleMode}
                                            type="button"
                                            className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors cursor-pointer"
                                        >
                                            {mode === 'login' ? 'Sign up' : 'Log in'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AuthModal;
