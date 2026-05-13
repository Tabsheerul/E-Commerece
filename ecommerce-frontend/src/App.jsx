import React, { useRef, useEffect } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const direction = useRef(1);

  const pageOrder = { '/': 0, '/shop': 1, '/product': 1.5, '/cart': 2, '/checkout': 2.5, '/admin': 3 };
  const getBaseRoute = (path) => path.startsWith('/product') ? '/product' : path;

  const currPathBase = getBaseRoute(location.pathname);
  const prevPathBase = getBaseRoute(prevPath.current);

  const currIndex = pageOrder[currPathBase] ?? 1;
  const prevIndex = pageOrder[prevPathBase] ?? 1;

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (currPathBase !== prevPathBase) {
    direction.current = currIndex >= prevIndex ? 1 : -1;
    prevPath.current = location.pathname;
  }

  const element = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/shop', element: <Shop /> },
    { path: '/product/:id', element: <ProductDetails /> },
    { path: '/cart', element: <Cart /> },
    { path: '/checkout', element: <Checkout /> },
    { path: '/admin', element: <AdminDashboard /> },
  ]);

  const variants = {
    initial: (dir) => ({ opacity: 0, x: dir === 1 ? 40 : -40 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir === 1 ? -40 : 40 }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction.current}>
      <motion.div
        key={location.pathname}
        custom={direction.current}
        variants={variants}
        initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Smoother, Apple-like easing curve
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
};

import Footer from './components/Footer';

// Inside App.jsx
const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        {/* Updated root background to #131318 */}
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#131318] text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-hidden">
          <Navbar />
          <main className="flex-grow w-full">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;