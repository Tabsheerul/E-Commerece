import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const Wishlist = () => {
  const { wishlistItems, loading } = useWishlist();

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4
                           bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10
                           text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            Your Favorites
          </span>
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white"
              style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
            My <span style={TEXT_GRADIENT}>Wishlist</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40 mt-2 text-lg font-light">
            All the products you love in one place.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-[4/5] rounded-[2rem] bg-slate-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="text-center py-28
                       bg-white dark:bg-zinc-900/40 rounded-[2rem]
                       border border-slate-200 dark:border-white/5
                       shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl"
          >
            <p className="text-6xl mb-5">💔</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Your wishlist is empty</h2>
            <p className="text-slate-500 dark:text-white/35 mb-8 max-w-sm mx-auto">
              You haven't saved any items yet. Start exploring and save your favorite designs!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                         font-bold py-3 px-8 rounded-full text-sm
                         hover:scale-105 active:scale-95 transition-transform duration-200">
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistItems.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
