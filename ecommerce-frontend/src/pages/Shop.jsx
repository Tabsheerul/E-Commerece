import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

// All the filter categories
const CATEGORIES = ['All', 'Anime', 'Automotive', 'Superheroes', 'Sports'];

// Reusable gradient style matching the Hero page
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Helper: shared slide-up entrance variant
const slideUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isNewOnly, setIsNewOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterTrigger, setFilterTrigger] = useState(0);

  // Track direction: +1 = going forward (higher page), -1 = going back (lower page)
  const pageDirection  = useRef(0);
  const prevPage       = useRef(0);
  const isPagination   = useRef(false); // true when only the page number changed
  const scrollRafId    = useRef(null);

  // Ref to the top of the product grid
  const gridRef = useRef(null);

  // Fetch products whenever filters or page change
  useEffect(() => {
    // Only show the loading skeleton when filters/search change, NOT on page turns.
    // This keeps the grid height stable so the scroll animation has nothing to fight.
    if (!isPagination.current) setLoading(true);

    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (searchTerm) params.append('keyword', searchTerm);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (isNewOnly) params.append('isNew', 'true');
    params.append('sortBy', sortBy);
    params.append('page', currentPage);
    params.append('size', 9);

    fetch(`http://localhost:8080/api/products/search?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
        isPagination.current = false;
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
        isPagination.current = false;
      });
  }, [searchTerm, sortBy, filterTrigger, currentPage]);

  // Scroll to top on pagination — no layout shift = perfectly smooth native scroll
  useEffect(() => {
    if (currentPage === 0 && prevPage.current === 0) return;
    pageDirection.current = currentPage >= prevPage.current ? 1 : -1;
    prevPage.current = currentPage;
    // Wait one paint frame so React has committed the render,
    // then let the browser's own smooth scroll engine do its job.
    if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current);
    scrollRafId.current = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return () => { if (scrollRafId.current) cancelAnimationFrame(scrollRafId.current); };
  }, [currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(0);
    setFilterTrigger(prev => prev + 1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setIsNewOnly(false);
    setSortBy('newest');
    setCurrentPage(0);
    setFilterTrigger(prev => prev + 1);
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">

      {/* ── Page Header ── */}
      <div className="mb-12 max-w-7xl mx-auto">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden" animate="show"
        >
          <motion.div variants={slideUp} className="mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                             bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10
                             text-slate-500 dark:text-white/50 text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
              Premium Collection
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div variants={slideUp}>
              <h1 className="font-black tracking-tighter text-slate-900 dark:text-white"
                  style={{ fontSize: 'clamp(2.5rem,6vw,4rem)' }}>
                The{' '}
                <span style={TEXT_GRADIENT}>Vault</span>
              </h1>
              <p className="text-slate-500 dark:text-white/40 mt-2 text-lg font-light">
                Browse our entire collection of premium skins and cases.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={slideUp} className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-full
                           bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10
                           text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30
                           focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-500 outline-none
                           backdrop-blur-sm transition-all duration-300 shadow-sm"
              />
              <svg className="w-5 h-5 text-slate-400 dark:text-white/30 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Body: Sidebar + Grid ── */}
      <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">

        {/* ── LEFT SIDEBAR: Filters ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-72 flex-shrink-0 sticky top-28 h-fit
                     bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                     border border-slate-200 dark:border-white/5
                     rounded-[1.5rem] p-6
                     shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-2xl
                     transition-colors duration-300"
        >
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 tracking-tight">Filters</h3>

          {/* Category Filter */}
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-4">Theme</h4>
            <div className="flex flex-col space-y-3">
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                  {/* Custom radio dot */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${selectedCategory === category
                      ? 'border-violet-500 dark:border-violet-400'
                      : 'border-slate-300 dark:border-white/20 group-hover:border-violet-400 dark:group-hover:border-violet-500'}`}>
                    {selectedCategory === category && (
                      <div className="w-2 h-2 bg-violet-500 dark:bg-violet-400 rounded-full" />
                    )}
                  </div>
                  <input type="radio" className="hidden" checked={selectedCategory === category} onChange={() => setSelectedCategory(category)} />
                  <span className={`text-sm transition-colors duration-200
                    ${selectedCategory === category
                      ? 'text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500 dark:text-white/45 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-4">Status</h4>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                ${isNewOnly
                  ? 'bg-violet-500 border-violet-500 dark:bg-violet-500 dark:border-violet-500'
                  : 'border-slate-300 dark:border-white/20 group-hover:border-violet-400'}`}>
                {isNewOnly && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input type="checkbox" className="hidden" checked={isNewOnly} onChange={e => setIsNewOnly(e.target.checked)} />
              <span className={`text-sm transition-colors duration-200
                ${isNewOnly ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-white/45'}`}>
                New Arrivals Only
              </span>
            </label>
          </div>

          {/* Filter Buttons */}
          <div className="pt-5 border-t border-slate-100 dark:border-white/8 flex flex-col gap-3">
            <button
              onClick={handleApplyFilters}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-full
                         hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200
                         shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_40px_rgba(139,92,246,0.35)]">
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="w-full bg-transparent border border-slate-200 dark:border-white/10
                         hover:bg-slate-100 dark:hover:bg-white/5
                         text-slate-600 dark:text-white/50 font-medium py-3 rounded-full transition-colors duration-200">
              Clear All
            </button>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: Product Grid ── */}
        <div className="flex-1">

          {/* Sort Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-between items-center mb-8
                       bg-white dark:bg-zinc-900/60 backdrop-blur-xl
                       px-5 py-3.5 rounded-2xl
                       border border-slate-200 dark:border-white/5
                       shadow-[0_4px_20px_-5px_rgba(0,0,0,0.06)] dark:shadow-xl
                       transition-colors duration-300"
          >
            <span className="text-slate-400 dark:text-white/35 text-sm">
              Showing <strong className="text-slate-900 dark:text-white">{products.length}</strong> results
            </span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 dark:text-white/35 text-sm hidden sm:block">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10
                           text-slate-900 dark:text-white text-sm rounded-full px-4 py-1.5 outline-none cursor-pointer
                           focus:ring-2 focus:ring-violet-500 transition-colors"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </motion.div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="aspect-[4/5] rounded-[2rem] bg-slate-200 dark:bg-white/5 animate-pulse" />
              ))}
            </div>

          // Empty state
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="text-center py-28
                         bg-white dark:bg-zinc-900/40 rounded-[2rem]
                         border border-slate-200 dark:border-white/5
                         shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl"
            >
              <p className="text-5xl mb-5">📱</p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">No designs found</h2>
              <p className="text-slate-500 dark:text-white/35 mb-8 max-w-xs mx-auto">
                Try adjusting your filters or search term to discover more.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black
                           font-bold py-3 px-8 rounded-full text-sm
                           hover:scale-105 active:scale-95 transition-transform duration-200">
                Clear Filters
              </button>
            </motion.div>

          ) : (
            <>
              {/* Product Grid — directional slide on page change */}
              <div ref={gridRef} className="scroll-mt-28">
                <AnimatePresence mode="wait" custom={pageDirection.current}>
                  <motion.div
                    key={currentPage}
                    custom={pageDirection.current}
                    variants={{
                      initial: (dir) => ({
                        opacity: 0,
                        x: dir >= 0 ? 80 : -80,
                        filter: 'blur(8px)',
                      }),
                      animate: {
                        opacity: 1,
                        x: 0,
                        filter: 'blur(0px)',
                        transition: {
                          duration: 0.55,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: 0.35,
                          opacity: { duration: 0.55, delay: 0.35 },
                          filter: { duration: 0.55, delay: 0.35 },
                        },
                      },
                      exit: (dir) => ({
                        opacity: 0,
                        x: dir >= 0 ? -80 : 80,
                        filter: 'blur(8px)',
                        transition: {
                          duration: 0.35,
                          ease: [0.55, 0, 1, 0.45],
                        },
                      }),
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {products.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-16 flex justify-center items-center gap-2"
                >
                  <button
                    onClick={() => { isPagination.current = true; setCurrentPage(prev => Math.max(0, prev - 1)); }}
                    disabled={currentPage === 0}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold
                               text-slate-600 dark:text-white/50 border border-slate-200 dark:border-white/10
                               hover:bg-slate-100 dark:hover:bg-white/5
                               disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                    ← Prev
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => { isPagination.current = true; setCurrentPage(index); }}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-200
                          ${currentPage === index
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg'
                            : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => { isPagination.current = true; setCurrentPage(prev => Math.min(totalPages - 1, prev + 1)); }}
                    disabled={currentPage === totalPages - 1}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold
                               text-slate-600 dark:text-white/50 border border-slate-200 dark:border-white/10
                               hover:bg-slate-100 dark:hover:bg-white/5
                               disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                    Next →
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;