import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Shared gradient style matching the Hero page
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Slide-up entrance animation reused from Hero page
const slideUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products for the table
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error("Error fetching admin products:", err); setLoading(false); });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' })
        .then(() => setProducts(products.filter(p => p.id !== id)))
        .catch(err => console.error("Error deleting product:", err));
    }
  };

  // Stats for the summary cards at the top
  const stats = [
    { label: 'Total Products',  value: products.length,                                       icon: '📦' },
    { label: 'New Arrivals',    value: products.filter(p => p.isNew).length,                  icon: '✨' },
    { label: 'Avg. Price',      value: products.length ? `$${(products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)}` : '—', icon: '💰' },
  ];

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen
                    bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">

      {/* ── Header Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-6"
      >
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4
                           bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10
                           text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            Admin Panel
          </span>
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white"
              style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}>
            <span style={TEXT_GRADIENT}>Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-white/35 mt-2 font-light">
            Manage your inventory and product listings.
          </p>
        </div>

        {/* Add Product Button */}
        <button className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                           font-bold py-3 px-6 rounded-full text-sm tracking-wide
                           shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_50px_rgba(139,92,246,0.35)]
                           hover:scale-[1.03] active:scale-95 transition-all duration-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </motion.div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                       border border-slate-200 dark:border-white/5
                       rounded-[1.5rem] p-6
                       shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl
                       flex items-center gap-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8
                            flex items-center justify-center text-2xl shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-white/30 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Products Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                   border border-slate-200 dark:border-white/5
                   rounded-[1.5rem] overflow-hidden
                   shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.15em]">
                <th className="p-5 pl-6">Product</th>
                <th className="p-5">Category</th>
                <th className="p-5">Price</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                // Loading skeleton rows
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="p-5">
                      <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0  }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-150"
                    >
                      {/* Product Image + Name */}
                      <td className="p-5 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0
                                          bg-slate-100 dark:bg-zinc-800">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-400 dark:text-white/25 mt-0.5">{product.device}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-5 text-sm text-slate-500 dark:text-white/40 font-medium">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="p-5 text-sm font-black text-slate-900 dark:text-white">
                        ${product.price}
                      </td>

                      {/* Status Badge */}
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase
                          ${product.isNew
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20'
                            : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/30 border border-slate-200 dark:border-white/8'
                          }`}>
                          {product.isNew ? '✨ New' : 'Standard'}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-5 pr-6 text-right space-x-4">
                        <button className="text-xs font-bold text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 transition-colors">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;