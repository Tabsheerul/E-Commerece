import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const MyOrders = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 rounded-full text-xs font-bold tracking-wider">PENDING</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-full text-xs font-bold tracking-wider">SHIPPED</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-full text-xs font-bold tracking-wider">DELIVERED</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70 rounded-full text-xs font-bold tracking-wider">{status}</span>;
    }
  };

  const getTrackingStages = (status) => {
    const s = status?.toUpperCase() || 'PENDING';
    const stages = [
      { label: "Order Placed", completed: true },
      { label: "Processing", completed: s === 'SHIPPED' || s === 'DELIVERED', active: s === 'PENDING' },
      { label: "Shipped", completed: s === 'DELIVERED', active: s === 'SHIPPED' },
      { label: "Delivered", completed: s === 'DELIVERED', active: s === 'DELIVERED' }
    ];
    return stages;
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white mb-3" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            My <span style={TEXT_GRADIENT}>Orders</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40 text-sm">
            Track your past purchases and shipping status.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-12 text-center shadow-xl"
          >
            <p className="text-5xl mb-4">📦</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-slate-500 dark:text-white/40 mb-6 text-sm">You haven't placed any orders with us. Time to change that!</p>
            <Link to="/shop" className="inline-block bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 px-8 rounded-full text-sm hover:scale-105 active:scale-95 transition-transform">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-white dark:bg-zinc-900/60 backdrop-blur-xl border ${expandedOrderId === order.id ? 'border-violet-500/50 dark:border-violet-400/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]' : 'border-slate-200 dark:border-white/5'} rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden`}
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 dark:text-white/30 tracking-widest uppercase mb-1">Order #{order.id}</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <p className="text-xl font-black" style={TEXT_GRADIENT}>${order.totalAmount?.toFixed(2)}</p>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <motion.svg 
                        animate={{ rotate: expandedOrderId === order.id ? 180 : 0 }}
                        className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </div>
                </div>

                {/* ── Order Items (Visible Before Expand) ── */}
                <div className="mt-6 mb-2 space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-black/50 rounded-xl flex items-center justify-center text-xl shadow-inner">
                          📦
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{item.productName}</p>
                          <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Device: {item.device || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-slate-900 dark:text-white">${item.price?.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 pb-4">
                        {/* ── Tracking Timeline ── */}
                        <div className="mb-10 px-2 sm:px-6">
                          <div className="relative">
                            {/* Background track */}
                            <div className="absolute top-4 left-0 w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                            {/* Active track */}
                            <div className="absolute top-4 left-0 h-1 bg-violet-500 rounded-full transition-all duration-700 ease-out" 
                                 style={{ width: `${(getTrackingStages(order.status).filter(s => s.completed || s.active).length - 1) / 3 * 100}%` }} />
                            
                            <div className="relative flex justify-between">
                              {getTrackingStages(order.status).map((stage, i) => (
                                <div key={i} className="flex flex-col items-center">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-500 delay-100
                                                  ${stage.completed || stage.active 
                                                    ? 'bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]' 
                                                    : 'bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-white/10 text-slate-400'}`}>
                                    {stage.completed ? '✓' : i + 1}
                                  </div>
                                  <span className={`text-[10px] sm:text-xs font-bold mt-3 text-center transition-colors duration-300
                                                   ${stage.active ? 'text-violet-600 dark:text-violet-400' 
                                                    : stage.completed ? 'text-slate-800 dark:text-white/90' 
                                                    : 'text-slate-400 dark:text-white/40'}`}>
                                    {stage.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ── Shipping Details ── */}
                        <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-5 border border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-white/30 tracking-widest uppercase mb-3">Shipping Details</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-white/70">{order.customerName}</p>
                            <p className="text-sm text-slate-500 dark:text-white/50">{order.address}</p>
                            <p className="text-sm text-slate-500 dark:text-white/50">{order.city}, {order.zip}</p>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-xs font-bold text-slate-400 dark:text-white/30 tracking-widest uppercase mb-3">Contact</p>
                            <p className="text-sm text-slate-500 dark:text-white/50">{order.email}</p>
                          </div>
                        </div>
                        
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
