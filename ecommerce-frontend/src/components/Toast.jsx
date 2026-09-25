import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        key="toast"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 20,  scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]
                    flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold
                    ${toast.type === 'success'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'}`}
      >
        <span>{toast.type === 'success' ? '✓' : '✕'}</span>
        {toast.message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Toast;
