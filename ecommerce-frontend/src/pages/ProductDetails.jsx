import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

// Shared gradient style matching the Hero page
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false); // for the "Added!" feedback state

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => { setProduct(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    // Reset button text after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] px-6 lg:px-24 transition-colors duration-500">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 animate-pulse">
          <div className="aspect-[4/5] rounded-[2rem] bg-slate-200 dark:bg-white/5" />
          <div className="space-y-5 pt-10">
            <div className="h-4 w-24 bg-slate-200 dark:bg-white/5 rounded-full" />
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-white/5 rounded-xl" />
            <div className="h-8 w-1/3 bg-slate-200 dark:bg-white/5 rounded-xl" />
            <div className="h-24 w-full bg-slate-200 dark:bg-white/5 rounded-xl" />
            <div className="h-14 w-full bg-slate-200 dark:bg-white/5 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── 404 state ──
  if (!product) {
    return (
      <div className="pt-32 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] flex flex-col items-center justify-center gap-6 transition-colors duration-500">
        <p className="text-6xl">📦</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Product not found!</h2>
        <Link to="/shop"
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                     font-bold py-3 px-8 rounded-full hover:scale-105 active:scale-95 transition-transform">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 lg:px-24 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">
      <div className="max-w-5xl mx-auto">

        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm text-slate-400 dark:text-white/30 mb-10 font-medium"
        >
          <Link to="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Home</Link>
          <span className="opacity-50">/</span>
          <Link to="/shop" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Shop</Link>
          <span className="opacity-50">/</span>
          <span className="text-slate-700 dark:text-white/60">{product.name}</span>
        </motion.div>

        {/* ── Main Product Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/5] rounded-[2rem] overflow-hidden
                       bg-white dark:bg-zinc-900
                       border border-slate-200 dark:border-white/5
                       shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]
                       group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center gap-4"
          >
            {/* Category label */}
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-violet-600 dark:text-violet-400">
              {product.category}
            </p>

            {/* New arrival badge */}
            {product.isNew && (
              <span className="inline-flex items-center gap-1.5 bg-violet-100 dark:bg-violet-500/10
                               text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20
                               text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                ✨ New Arrival
              </span>
            )}

            {/* Product name */}
            <h1 className="font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]"
                style={{ fontSize: 'clamp(2rem,5vw,3.5rem)' }}>
              {product.name}
            </h1>

            {/* Device compatibility */}
            {product.device && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl
                              bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8
                              text-slate-500 dark:text-white/40 text-sm w-fit">
                <span className="text-lg">📱</span>
                <span>Compatible with <strong className="text-slate-800 dark:text-white/70">{product.device}</strong></span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-black text-slate-900 dark:text-white" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
                ${product.price.toFixed(2)}
              </span>
              <span className="text-slate-400 dark:text-white/30 text-sm font-medium ml-1">USD</span>
            </div>

            {/* Thin divider */}
            <div className="h-px w-full bg-slate-200 dark:bg-white/8 my-2" />

            {/* Description */}
            <p className="text-slate-600 dark:text-white/45 leading-relaxed text-base font-light">
              {product.description}
            </p>

            {/* ── Material badges row ── */}
            <div className="flex flex-wrap gap-2 mt-1">
              {['3M Vinyl', 'Zero Residue', 'Scratch-Proof', 'Air-Release'].map(tag => (
                <span key={tag}
                  className="px-3 py-1 text-xs font-semibold rounded-full
                             bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10
                             text-slate-600 dark:text-white/50">
                  {tag}
                </span>
              ))}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className={`mt-4 w-full flex items-center justify-center gap-3 font-bold py-4 px-8 rounded-full text-sm tracking-wide
                          transition-all duration-300
                          ${added
                            ? 'bg-green-500 text-white shadow-[0_0_40px_rgba(34,197,94,0.4)]'
                            : 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.4)] hover:scale-[1.02]'
                          }`}
            >
              {added ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </motion.button>

            {/* Trust note */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-white/25 mt-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Free shipping on orders over $40</span>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
