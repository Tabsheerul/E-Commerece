import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../components/CustomDropdown';
import { AuthContext } from '../context/AuthContext';

/* ── Design tokens ─────────────────────────────────────────── */
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

import Toast from '../components/Toast';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import ProductModal from '../components/admin/ProductModal';
import { CATEGORIES } from '../utils/constants';

/* ════════════════════════════════════════════════════════════ */
/*  Main AdminDashboard                                         */
/* ════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [activeTab, setActiveTab]   = useState('products'); // 'products' or 'orders'
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = add mode
  const [toast, setToast]           = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  /* Fetch all products */
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error('Error fetching admin products:', err); setLoading(false); });
  }, []);

  /* Fetch all orders */
  useEffect(() => {
    if (activeTab === 'orders' && token) {
      setLoadingOrders(true);
      fetch('http://localhost:8080/api/orders/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => { setOrders(data); setLoadingOrders(false); })
      .catch(err => { console.error('Error fetching orders:', err); setLoadingOrders(false); });
    }
  }, [activeTab, token]);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Failed to update status');
    })
    .then(updatedOrder => {
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      showToast(`Order #${orderId} marked as ${newStatus}`);
    })
    .catch(() => showToast('Error updating status', 'error'));
  };

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  /* Delete */
  const handleDelete = (id) => {
    setDeleteCandidate(id);
  };

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    fetch(`http://localhost:8080/api/products/${deleteCandidate}`, { method: 'DELETE' })
      .then(() => {
        setProducts(p => p.filter(x => x.id !== deleteCandidate));
        showToast('Product deleted successfully.');
        setDeleteCandidate(null);
      })
      .catch(() => {
        showToast('Failed to delete product.', 'error');
        setDeleteCandidate(null);
      });
  };

  /* Called by modal on success */
  const handleSaved = (savedProduct, isEdit) => {
    if (isEdit) {
      setProducts(p => p.map(x => x.id === savedProduct.id ? savedProduct : x));
      showToast('Product updated successfully.');
    } else {
      setProducts(p => [savedProduct, ...p]);
      showToast('Product added successfully.');
    }
    setShowModal(false);
    setEditProduct(null);
  };

  const openAdd  = () => { setEditProduct(null); setShowModal(true); };
  const openEdit = (product) => { setEditProduct(product); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditProduct(null); };

  /* Filters */
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.device.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  /* Stats */
  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦' },
    { label: 'New Arrivals',   value: products.filter(p => p.isNew).length, icon: '✨' },
    { label: 'Total Orders',   value: activeTab === 'orders' ? orders.length : '—', icon: '🛒' },
  ];

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen flex items-center justify-center
                      bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-12 text-center shadow-2xl max-w-lg w-full"
        >
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-500/10 mx-auto mb-8 flex items-center justify-center text-red-500">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 dark:text-white/40 mb-8 text-base leading-relaxed">
            Oops! It looks like you don't have the necessary administrative privileges to view this page. If you believe this is a mistake, please contact support.
          </p>
          <a href="/" className="inline-block w-full py-4 rounded-full font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-colors">
            Return Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen
                    bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">

      {/* ── Header ── */}
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

        {/* Tabs & Actions */}
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-2 p-1 bg-white dark:bg-zinc-900/60 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'products' ? 'bg-violet-500 text-white shadow-md' : 'text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'orders' ? 'bg-violet-500 text-white shadow-md' : 'text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              Orders
            </button>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                         font-bold py-3 px-6 rounded-full text-sm tracking-wide
                         shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_50px_rgba(139,92,246,0.35)]
                         hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          )}
        </div>
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

      {/* ── Main Content Area ── */}
      {activeTab === 'products' ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                     border border-slate-200 dark:border-white/5
                     rounded-[1.5rem] overflow-hidden
                     shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-2xl"
        >
          {/* Filters Bar */}
          <div className="relative z-50 p-5 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or device..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <CustomDropdown
                value={filterCategory}
                onChange={setFilterCategory}
                options={[
                  { label: 'All Categories', value: 'All' },
                  ...CATEGORIES.map(c => ({ label: c, value: c }))
                ]}
                buttonClassName="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                dropdownClassName="right-0 w-full min-w-[12rem]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5
                               text-[11px] font-bold text-slate-400 dark:text-white/30
                               uppercase tracking-[0.15em]">
                  <th className="p-5 pl-6">Product</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="p-5">
                        <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-400 dark:text-white/25">
                      <div className="text-4xl mb-3">📦</div>
                      <p className="font-semibold">No products found.</p>
                      {(searchTerm || filterCategory !== 'All') ? (
                        <button
                          onClick={() => { setSearchTerm(''); setFilterCategory('All'); }}
                          className="mt-4 text-violet-500 hover:text-violet-700 dark:hover:text-violet-300
                                     text-sm font-bold underline-offset-2 hover:underline transition-colors"
                        >
                          Clear filters →
                        </button>
                      ) : (
                        <button
                          onClick={openAdd}
                          className="mt-4 text-violet-500 hover:text-violet-700 dark:hover:text-violet-300
                                     text-sm font-bold underline-offset-2 hover:underline transition-colors"
                        >
                          Add your first product →
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.4, delay: index * 0.04 }}
                        className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors duration-150"
                      >
                        {/* Image + Name */}
                        <td className="p-5 pl-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0
                                            bg-slate-100 dark:bg-zinc-800">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.style.display = 'none'; }}
                              />
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
                          ${Number(product.price).toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="p-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase
                            ${product.isNew
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20'
                              : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/30 border border-slate-200 dark:border-white/8'
                            }`}>
                            {product.isNew ? '✨ New' : 'Standard'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-5 pr-6 text-right space-x-4">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-xs font-bold text-violet-600 hover:text-violet-800
                                       dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700
                                       dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                     border border-slate-200 dark:border-white/5
                     rounded-[1.5rem] overflow-hidden
                     shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5
                               text-[11px] font-bold text-slate-400 dark:text-white/30
                               uppercase tracking-[0.15em]">
                  <th className="p-5 pl-6">Order ID</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 pr-6 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {loadingOrders ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="p-5">
                        <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-slate-400 dark:text-white/25">
                      <div className="text-4xl mb-3">🛒</div>
                      <p className="font-semibold">No orders found.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors duration-150">
                      <td className="p-5 pl-6 font-bold text-slate-900 dark:text-white">#{order.id}</td>
                      <td className="p-5">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customerName}</p>
                        <p className="text-xs text-slate-400 dark:text-white/30">{order.email}</p>
                      </td>
                      <td className="p-5 font-black text-slate-900 dark:text-white">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="p-5 text-sm text-slate-500 dark:text-white/40">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-5 pr-6 text-right w-48">
                        <div className="relative inline-block text-left">
                          <CustomDropdown
                            value={order.status}
                            onChange={(val) => handleUpdateStatus(order.id, val)}
                            options={[
                              { label: 'PENDING', value: 'PENDING' },
                              { label: 'SHIPPED', value: 'SHIPPED' },
                              { label: 'DELIVERED', value: 'DELIVERED' }
                            ]}
                            buttonClassName={`w-full px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shadow-sm
                              ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
                                : order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'}`}
                            dropdownClassName="right-0 w-40 mt-2"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            editProduct={editProduct}
            onClose={closeModal}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <DeleteConfirmModal 
        isOpen={!!deleteCandidate} 
        onClose={() => setDeleteCandidate(null)} 
        onConfirm={confirmDelete} 
      />

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </div>
  );
};

export default AdminDashboard;