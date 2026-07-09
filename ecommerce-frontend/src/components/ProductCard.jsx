import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

// Reusable gradient style (matches Hero page)
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const ProductCard = ({ product, index = 0 }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent navigating to product details
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    // Slide-up entrance animation staggered by index
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.id}`} className="group block">

        {/* Image Box */}
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative mb-5
                        bg-white dark:bg-zinc-900
                        border border-slate-200 dark:border-white/5
                        shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-none">

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.07] transition-transform duration-700 ease-out"
          />

          {/* Dark overlay that slides in on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* "NEW" badge */}
          {product.isNew && (
            <div className="absolute top-4 left-4 bg-slate-900 text-white dark:bg-white dark:text-black
                            text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest shadow-md">
              NEW
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300
              ${isWishlisted 
                ? 'bg-pink-500/90 text-white shadow-lg shadow-pink-500/30 scale-110' 
                : 'bg-white/50 dark:bg-black/40 text-slate-700 dark:text-white/70 hover:bg-white dark:hover:bg-black hover:text-pink-500 hover:scale-110'
              }`}
          >
            <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick-add button appears on hover */}
          <button 
            onClick={handleAddToCart}
            className={`absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-3 opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300
                        ${added ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-slate-100'} 
                        text-xs font-bold px-5 py-2.5 rounded-full whitespace-nowrap shadow-xl z-20`}
          >
            {added ? 'Added! ✓' : '+ Quick Add'}
          </button>
        </div>

        {/* Product info row */}
        <div className="flex justify-between items-start px-1">
          <div>
            {/* Category label */}
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/35 mb-1">
              {product.category}
            </p>
            {/* Product name with gradient on hover */}
            <h3 className="text-slate-900 dark:text-white font-bold text-base line-clamp-1
                           group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-200">
              {product.name}
            </h3>
          </div>
          <span className="text-slate-900 dark:text-white font-bold text-base mt-5 shrink-0">
            ${product.price}
          </span>
        </div>

      </Link>
    </motion.div>
  );
};

export default ProductCard;