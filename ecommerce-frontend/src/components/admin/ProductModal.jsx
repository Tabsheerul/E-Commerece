import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CustomDropdown from '../CustomDropdown';
import { CATEGORIES } from '../../utils/constants';

const EMPTY_FORM = {
  name: '',
  category: 'Anime',
  price: '',
  description: '',
  image: '',
  device: '',
  isNew: false,
};

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
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      <motion.div
        className="relative z-10 h-full w-full max-w-lg overflow-y-auto
                   bg-white dark:bg-[#111116]
                   shadow-[−20px_0_60px_rgba(0,0,0,0.3)]
                   flex flex-col"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 35 }}
        onClick={e => e.stopPropagation()}
      >
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

        <form onSubmit={handleSubmit} className="flex-1 px-8 py-6 space-y-5">
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

          <Field label="Description">
            <textarea
              rows={3}
              placeholder="Short product description..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </Field>

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

          {errors.submit && (
            <p className="text-red-500 text-sm font-medium text-center">{errors.submit}</p>
          )}
        </form>

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

export default ProductModal;
