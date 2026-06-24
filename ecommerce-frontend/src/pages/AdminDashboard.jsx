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

const CATEGORIES = ['Anime', 'Automotive', 'Superheroes', 'Sports'];

const EMPTY_FORM = {
  name: '',
  category: 'Anime',
  price: '',
  description: '',
  image: '',
  device: '',
  isNew: false,
};

/* ── Tiny Toast component ───────────────────────────────────── */
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

/* ── Reusable labelled input ───────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-[0.15em] mb-2">
      {label}{required && <span className="text-violet-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = `w-full px-4 py-3 rounded-xl text-sm
  bg-slate-100 dark:bg-white/5
  border border-slate-200 dark:border-white/8
  text-slate-900 dark:text-white
  placeholder-slate-400 dark:placeholder-white/25
  focus:outline-none focus:ring-2 focus:ring-violet-500
  transition-all duration-200`;

/* ════════════════════════════════════════════════════════════ */
/*  Add / Edit Modal Drawer                                     */
/* ════════════════════════════════════════════════════════════ */
const ProductModal = ({ editProduct, onClose, onSaved }) => {
  const isEdit = Boolean(editProduct);
  const [form, setForm] = useState(isEdit ? { ...editProduct } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => { firstInputRef.current?.focus(); }, []);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name  = 'Product name is required.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
                               e.price = 'Enter a valid price greater than 0.';
    if (!form.device.trim())   e.device = 'Device / model is required.';
    if (!form.image.trim())    e.image  = 'Image URL is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    const payload = { ...form, price: Number(form.price) };
    const url    = isEdit
      ? `http://localhost:8080/api/products/${editProduct.id}`
      : 'http://localhost:8080/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
      const saved = await res.json();
      onSaved(saved, isEdit);
    } catch {
      setSaving(false);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    }
  };

  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      {/* Drawer panel */}
      <motion.div
        className="relative z-10 h-full w-full max-w-lg overflow-y-auto
                   bg-white dark:bg-[#111116]
                   shadow-[−20px_0_60px_rgba(0,0,0,0.3)]
                   flex flex-col"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 35 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6
                        border-b border-slate-100 dark:border-white/5 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]
                          text-slate-400 dark:text-white/30 mb-1">
              {isEdit ? 'Editing product' : 'New product'}
            </p>
            <h2 className="text-2xl font-black tracking-tight
                           text-slate-900 dark:text-white">
              {isEdit ? 'Edit Product' : 'Add Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       bg-slate-100 dark:bg-white/5
                       hover:bg-slate-200 dark:hover:bg-white/10
                       text-slate-500 dark:text-white/50
                       transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 px-8 py-6 space-y-5">

          {/* Live image preview */}
          <div className="w-full h-48 rounded-2xl overflow-hidden
                          bg-slate-100 dark:bg-white/5
                          border-2 border-dashed border-slate-200 dark:border-white/10
                          flex items-center justify-center mb-2">
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="text-center text-slate-400 dark:text-white/20">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-xs font-medium">Image preview</p>
              </div>
            )}
          </div>

          {/* Image URL */}
          <Field label="Image URL" required>
            <input
              ref={firstInputRef}
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={e => set('image', e.target.value)}
              className={inputCls}
            />
            {errors.image && <p className="text-red-500 text-xs mt-1.5">{errors.image}</p>}
          </Field>

          {/* Name */}
          <Field label="Product Name" required>
            <input
              type="text"
              placeholder="e.g. Dragon Ball Z Skin for iPhone 15"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className={inputCls}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
          </Field>

          {/* Device */}
          <Field label="Device / Model" required>
            <input
              type="text"
              placeholder="e.g. iPhone 15 Pro, Galaxy S24 Ultra"
              value={form.device}
              onChange={e => set('device', e.target.value)}
              className={inputCls}
            />
            {errors.device && <p className="text-red-500 text-xs mt-1.5">{errors.device}</p>}
          </Field>

          {/* Category + Price side by side */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <CustomDropdown
                value={form.category}
                onChange={val => set('category', val)}
                options={CATEGORIES.map(c => ({ label: c, value: c }))}
                buttonClassName={inputCls}
                dropdownClassName="left-0 w-full"
              />
            </Field>

            <Field label="Price (USD)" required>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 dark:text-white/40 font-medium">
                  $
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  className={`${inputCls} pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1.5">{errors.price}</p>}
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea
              rows={3}
              placeholder="Short product description..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Is New toggle */}
          <div className="flex items-center justify-between
                          bg-slate-50 dark:bg-white/5
                          border border-slate-200 dark:border-white/8
                          rounded-xl px-5 py-4">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">New Arrival</p>
              <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">
                Shows a "New" badge on the product card
              </p>
            </div>
            <button
              type="button"
              onClick={() => set('isNew', !form.isNew)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                          ${form.isNew ? 'bg-violet-500' : 'bg-slate-200 dark:bg-white/10'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                                transition-transform duration-300
                                ${form.isNew ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <p className="text-red-500 text-sm font-medium text-center">{errors.submit}</p>
          )}
        </form>

        {/* Footer buttons */}
        <div className="px-8 pb-8 pt-4 shrink-0
                        border-t border-slate-100 dark:border-white/5
                        flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold
                       border border-slate-200 dark:border-white/10
                       text-slate-600 dark:text-white/50
                       hover:bg-slate-50 dark:hover:bg-white/5
                       transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white
                       bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400
                       hover:opacity-90 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-[0_0_30px_rgba(139,92,246,0.35)]
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving…
              </>
            ) : (
              isEdit ? 'Save Changes' : 'Add Product'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════ */
/*  Main AdminDashboard                                         */
/* ════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = add mode
  const [toast, setToast]           = useState(null);

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

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  /* Delete */
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    fetch(`http://localhost:8080/api/products/${id}`, { method: 'DELETE' })
      .then(() => {
        setProducts(p => p.filter(x => x.id !== id));
        showToast('Product deleted successfully.');
      })
      .catch(() => showToast('Failed to delete product.', 'error'));
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
    {
      label: 'Avg. Price',
      value: products.length
        ? `$${(products.reduce((s, p) => s + Number(p.price), 0) / products.length).toFixed(2)}`
        : '—',
      icon: '💰',
    },
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

        {/* Add Product Button */}
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

      {/* ── Toast ── */}
      <Toast toast={toast} />
    </div>
  );
};

export default AdminDashboard;