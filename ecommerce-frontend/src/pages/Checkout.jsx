import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Shared gradient style matching the Hero page
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Reusable styled input component (keeps form code clean)
const FormInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-white/30">
        {label}
      </label>
    )}
    <input
      {...props}
      className="w-full px-4 py-3.5 rounded-xl
                 bg-slate-100 dark:bg-white/5
                 border border-slate-200 dark:border-white/10
                 text-slate-900 dark:text-white
                 placeholder-slate-400 dark:placeholder-white/20
                 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500
                 outline-none transition-all duration-200 text-sm"
    />
  </div>
);

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [shipping, setShipping] = useState({
    customerName: '', email: '', address: '', city: '', zip: ''
  });

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedItems = cartItems.map(item => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderData = {
      ...shipping,
      totalAmount: getCartTotal(),
      items: formattedItems
    };

    fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
      .then(response => {
        if (response.ok) {
          setIsSuccess(true);
          clearCart();
          // Give the success animation time to show, then redirect
          setTimeout(() => navigate('/cart'), 2000);
        } else {
          alert("Failed to place order. Please try again.");
          setIsSubmitting(false);
        }
      });
  };

  // ── Empty cart redirect state ──
  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center gap-5 transition-colors duration-500">
        <p className="text-5xl">🛒</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your cart is empty!</h2>
        <Link to="/shop"
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                     font-bold py-3 px-8 rounded-full hover:scale-105 active:scale-95 transition-transform">
          Browse the Vault →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 min-h-screen
                    bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500
                    flex items-start justify-center">

      <div className="w-full max-w-2xl">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4
                           bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10
                           text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Final Step
          </span>
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white"
              style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Secure <span style={TEXT_GRADIENT}>Checkout</span>
          </h1>
        </motion.div>

        {/* ── Order Summary Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                     border border-slate-200 dark:border-white/5
                     rounded-[1.5rem] p-6 mb-6
                     shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl"
        >
          <h2 className="font-bold text-slate-700 dark:text-white/70 text-sm uppercase tracking-[0.15em] mb-5">Order Summary</h2>
          <div className="space-y-3 mb-5">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-white/40">
                  <span className="font-bold text-slate-700 dark:text-white/70">{item.quantity}×</span> {item.name}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-slate-100 dark:bg-white/8 mb-5" />
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-900 dark:text-white">Total</span>
            <span className="text-2xl font-black" style={TEXT_GRADIENT}>${getCartTotal().toFixed(2)}</span>
          </div>
        </motion.div>

        {/* ── Shipping Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                     border border-slate-200 dark:border-white/5
                     rounded-[1.5rem] p-6
                     shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl"
        >
          <h2 className="font-bold text-slate-700 dark:text-white/70 text-sm uppercase tracking-[0.15em] mb-6">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <FormInput label="Full Name"    required type="text"  name="customerName" placeholder="John Doe"              onChange={handleInputChange} />
            <FormInput label="Email"        required type="email" name="email"        placeholder="john@example.com"       onChange={handleInputChange} />
            <FormInput label="Address"      required type="text"  name="address"      placeholder="123 Main Street"        onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="City"     required type="text" name="city" placeholder="New York"  onChange={handleInputChange} />
              <FormInput label="ZIP Code" required type="text" name="zip"  placeholder="10001"     onChange={handleInputChange} />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              className={`w-full mt-4 font-bold py-4 rounded-full text-sm tracking-wide transition-all duration-300
                ${isSuccess
                  ? 'bg-green-500 text-white shadow-[0_0_40px_rgba(34,197,94,0.4)]'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.35)] hover:scale-[1.02]'
                } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSuccess ? '✓ Order Placed Successfully!' : isSubmitting ? 'Processing...' : 'Place Order →'}
            </motion.button>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-white/25 mt-3">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>256-bit SSL encrypted & secure</span>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Checkout;