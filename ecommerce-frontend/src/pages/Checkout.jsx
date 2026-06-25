import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [shipping, setShipping] = useState({
    customerName: user?.username || '', 
    email: user?.email || '', 
    address: '', 
    city: '', 
    zip: ''
  });

  // Automatically update the form if the user logs in while on this page
  React.useEffect(() => {
    if (user) {
      setShipping(prev => ({
        ...prev,
        customerName: prev.customerName || user.username || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '', expiry: '', cvc: '', nameOnCard: '', upiId: ''
  });

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'expiry') {
      let cleanValue = value.replace(/\D/g, ''); // Remove non-digits
      if (cleanValue.length > 0) {
        if (cleanValue.length >= 2) {
          let month = parseInt(cleanValue.substring(0, 2), 10);
          // Auto-fix invalid months seamlessly
          if (month > 12) cleanValue = '12' + cleanValue.substring(2);
          if (month === 0) cleanValue = '01' + cleanValue.substring(2);
          cleanValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
        }
      }
      setPaymentDetails(prev => ({ ...prev, [name]: cleanValue }));
      return;
    }

    if (name === 'cardNumber') {
      let cleanValue = value.replace(/\D/g, ''); // Remove non-digits
      // Auto-add spaces every 4 digits
      let formatted = cleanValue.match(/.{1,4}/g)?.join(' ') || '';
      setPaymentDetails(prev => ({ ...prev, [name]: formatted.substring(0, 19) }));
      return;
    }

    if (name === 'cvc') {
      let cleanValue = value.replace(/\D/g, ''); // Remove non-digits
      setPaymentDetails(prev => ({ ...prev, [name]: cleanValue.substring(0, 4) }));
      return;
    }

    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing delay (1.5 seconds)
    setTimeout(() => {
      const formattedItems = cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        device: item.device,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        ...shipping,
        totalAmount: getCartTotal(),
        items: formattedItems
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      })
        .then(response => {
          if (response.ok) {
            setIsSuccess(true);
            clearCart();
            // Give the success animation time to show, then redirect
            setTimeout(() => {
              if (token) {
                navigate('/my-orders');
              } else {
                navigate('/shop');
              }
            }, 3500); // Wait for the 3.5 seconds to watch the animation
          } else {
            alert("Failed to place order. Please try again.");
            setIsSubmitting(false);
          }
        });
    }, 1500);
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
    <>
      {/* Success Modal Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-[2rem] p-10 max-w-sm w-full mx-6 shadow-2xl text-center"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                ✓
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Order Confirmed!</h2>
              <p className="text-sm text-slate-500 dark:text-white/50 mb-6">
                Your luxury skin is being prepared. {token ? "Redirecting to your orders..." : "Redirecting to shop..."}
              </p>
              <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3.5, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <FormInput label="Full Name"    required type="text"  name="customerName" value={shipping.customerName} placeholder="John Doe"              onChange={handleInputChange} />
            <FormInput label="Email"        required type="email" name="email"        value={shipping.email}        placeholder="john@example.com"       onChange={handleInputChange} />
            <FormInput label="Address"      required type="text"  name="address"      value={shipping.address}      placeholder="123 Main Street"        onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="City"     required type="text" name="city" value={shipping.city} placeholder="New York"  onChange={handleInputChange} />
              <FormInput label="ZIP Code" required type="text" name="zip"  value={shipping.zip}  placeholder="10001"     onChange={handleInputChange} />
            </div>

            {/* Payment Section */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
              <h3 className="font-bold text-slate-700 dark:text-white/70 text-sm uppercase tracking-[0.15em] mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: '💳' },
                  { id: 'bhim_upi', label: 'BHIM UPI', icon: '📱' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️' }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all duration-200
                      ${paymentMethod === method.id 
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 shadow-sm'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-xs font-bold">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Fields */}
              {paymentMethod === 'credit_card' ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <FormInput label="Card Number" required type="text" name="cardNumber" value={paymentDetails.cardNumber} placeholder="0000 0000 0000 0000" maxLength="19" onChange={handlePaymentChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Expiry Date" required type="text" name="expiry" value={paymentDetails.expiry} placeholder="MM/YY" maxLength="5" onChange={handlePaymentChange} />
                    <FormInput label="CVC" required type="password" name="cvc" value={paymentDetails.cvc} placeholder="123" maxLength="4" onChange={handlePaymentChange} />
                  </div>
                  <FormInput label="Name on Card" required type="text" name="nameOnCard" value={paymentDetails.nameOnCard} placeholder="John Doe" onChange={handlePaymentChange} />
                </motion.div>
              ) : paymentMethod === 'bhim_upi' ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <FormInput label="UPI ID / VPA" required type="text" name="upiId" placeholder="username@upi" onChange={handlePaymentChange} />
                  <div className="flex items-center justify-center py-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                    <p className="text-xs font-medium text-slate-500 dark:text-white/40 text-center">
                      A payment request will be sent to your UPI app.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center py-6 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                >
                  <p className="text-sm font-medium text-slate-500 dark:text-white/40 text-center">
                    You will be redirected to PayPal to complete your purchase.
                  </p>
                </motion.div>
              )}
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
    </>
  );
};

export default Checkout;