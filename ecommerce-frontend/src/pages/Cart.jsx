import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

// Shared gradient style matching the Hero page
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Animation variant for each cart item entering and exiting
  const itemVariants = {
    hidden:  { opacity: 0, y: 20, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, x: -30, scale: 0.95, transition: { duration: 0.25 } }
  };

  // ── Empty cart state ──
  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center
                      bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-sm"
        >
          {/* Icon circle */}
          <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center
                          bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10
                          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl">
            <svg className="w-10 h-10 text-slate-400 dark:text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Your vault is <span style={TEXT_GRADIENT}>empty</span>
          </h2>
          <p className="text-slate-500 dark:text-white/35 mb-8 leading-relaxed">
            Looks like you haven't added any skins yet. Discover our premium collection and find your style.
          </p>
          <Link to="/shop"
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                       font-bold py-3.5 px-8 rounded-full text-sm tracking-wide
                       shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.35)]
                       hover:scale-[1.03] active:scale-95 transition-all duration-300">
            Start Shopping →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen
                    bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">

      {/* ── Page Headline ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4
                         bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10
                         text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
        <h1 className="font-black tracking-tighter text-slate-900 dark:text-white"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}>
          Review <span style={TEXT_GRADIENT}>Order</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Cart Items ── */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                initial="hidden" animate="visible" exit="exit"
                transition={{ delay: index * 0.08 }}
                className="flex flex-col sm:flex-row items-center gap-5 p-5
                           bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                           border border-slate-200 dark:border-white/5
                           rounded-[1.5rem]
                           shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl
                           transition-colors duration-300"
              >
                {/* Product image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0
                                bg-slate-100 dark:bg-zinc-800">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Product details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-white/30 mt-1 uppercase tracking-wider">{item.device}</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-2">${item.price}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center bg-slate-100 dark:bg-white/5
                                  border border-slate-200 dark:border-white/10 rounded-full p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold
                                 text-slate-500 dark:text-white/50
                                 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900 dark:text-white text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold
                                 text-slate-500 dark:text-white/50
                                 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-28
                       bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                       border border-slate-200 dark:border-white/5
                       rounded-[1.5rem] p-6
                       shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-2xl"
          >
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-7 tracking-tight">Summary</h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-white/40">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-white/40">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">Calculated at checkout</span>
              </div>
              {/* Divider */}
              <div className="h-px bg-slate-100 dark:bg-white/8 w-full my-2" />
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 dark:text-white text-base">Total</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Link to="/checkout">
              <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-full text-sm tracking-wide
                                 shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.35)]
                                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                Proceed to Checkout →
              </button>
            </Link>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-white/25">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure Encrypted Checkout</span>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Cart;