import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

/* 
  ── Glow orb Component ── 
  This creates the colorful blurry circles floating in the background. 
*/
const Orb = ({ style, color }) => (
  <div className="absolute rounded-full pointer-events-none"
    style={{ ...style, background: color, filter: 'blur(100px)', opacity: 0.22 }} />
);

/* 
  ── Badge chip Component ── 
  A small reusable component for the pill-shaped labels (like "NEW" or "HOT").
*/
const Badge = ({ children, className = '' }) => (
  <div className={`absolute backdrop-blur-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 text-slate-800 dark:text-white
                   rounded-2xl px-4 py-2 text-xs font-semibold shadow-xl pointer-events-none select-none ${className}`}>
    {children}
  </div>
);

/* ── Gradient Arrow icon Component ──
   Uses an SVG linearGradient so the stroke itself is violet→pink→orange.
   The unique id "arrowGrad" is defined once and reused by every instance. */
const Arrow = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
    <defs>
      <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#a78bfa" />
        <stop offset="55%"  stopColor="#f472b6" />
        <stop offset="100%" stopColor="#fb923c" />
      </linearGradient>
    </defs>
    <path strokeLinecap="round" strokeLinejoin="round" stroke="url(#arrowGrad)"
      d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// A reusable CSS object for our vibrant sunset gradient text
const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text', 
  WebkitTextFillColor: 'transparent', 
  backgroundClip: 'text',
};


/* ═══════════════════════════════════════════════════
   HERO COMPONENT
═══════════════════════════════════════════════════ */
const Hero = () => {
  // Refs let us select specific HTML elements so Framer Motion knows when they scroll into view
  const heroSectionRef  = useRef(null);
  const phoneSectionRef = useRef(null);

  /* 
    ── 1. Mouse Tracking Animation (For the floating Orbs) ── 
    We use Framer Motion values to track the user's mouse position and create a smooth "spring" effect.
  */
  const mouseRawX = useMotionValue(0); // Stores the raw X (horizontal) position of the mouse
  const mouseRawY = useMotionValue(0); // Stores the raw Y (vertical) position of the mouse
  
  // A spring configuration adds physics (bounciness/smoothness) to the movement
  const springConfig = { stiffness: 55, damping: 18 };
  
  // We wrap our raw mouse values in the spring config so the orbs don't jump instantly, but glide smoothly
  const smoothMouseX = useSpring(mouseRawX, springConfig);
  const smoothMouseY = useSpring(mouseRawY, springConfig);
  
  // We create different translation values for the background "orbs". 
  // By multiplying by different numbers (e.g. 0.2 vs 0.55), they move at different speeds, creating a 3D parallax depth effect.
  const orbLayer1X = useTransform(smoothMouseX, value => value * 0.2);
  const orbLayer1Y = useTransform(smoothMouseY, value => value * 0.2);
  
  const orbLayer2X = useTransform(smoothMouseX, value => value * 0.55);
  const orbLayer2Y = useTransform(smoothMouseY, value => value * 0.55);

  // This hook runs once when the component loads. It constantly listens for the mouse moving across the screen.
  useEffect(() => {
    const handleMouseMove = (event) => {
      // We calculate the mouse position relative to the center of the screen
      // (event.clientX / window.innerWidth) gives a value between 0 and 1.
      // Subtracting 0.5 makes it between -0.5 and 0.5 (center is 0).
      // Multiplying by 40 or 30 dictates how far the orbs are allowed to move in pixels.
      mouseRawX.set(((event.clientX / window.innerWidth)  - 0.5) * 40);
      mouseRawY.set(((event.clientY / window.innerHeight) - 0.5) * 30);
    };
    
    // Attach the event listener to the window
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function to remove the listener if the user leaves the page
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseRawX, mouseRawY]);

  /* 
    ── 2. Scroll Animations (For the Video Section) ── 
  */
  // useScroll tracks how far down the user has scrolled past a specific element (heroSectionRef)
  const { scrollYProgress: heroScrollProgress } = useScroll({ 
    target: heroSectionRef, 
    // This offset means: start tracking when the top of the element hits the top of the screen, 
    // and stop when the bottom of the element hits the top of the screen.
    offset: ['start start', 'end start'] 
  });
  
  // useTransform maps the scroll progress (from 0 to 1) to specific CSS values.
  // As the user scrolls down (0 -> 1), the background moves down (0% -> 30%) and slightly zooms in.
  const videoBackgroundY = useTransform(heroScrollProgress, [0, 1], ['0%', '30%']);
  const videoScale       = useTransform(heroScrollProgress, [0, 1], [1, 1.08]);
  
  // The main text moves down slightly faster than the background to create depth
  const textContainerY = useTransform(heroScrollProgress, [0, 1], ['0%', '50%']);
  
  // The text fades out entirely by the time the user has scrolled 70% of the way down
  const heroTextOpacityFade = useTransform(heroScrollProgress, [0, 0.7], [1, 0]);

  /* ── 3. Scroll Animations (For the Bento Grid Phones) ── */
  // We do the same thing here, but tracking the phoneSectionRef instead
  const { scrollYProgress: phoneScrollProgress } = useScroll({ target: phoneSectionRef, offset: ['start end','end start'] });
  
  // If we had fanning phones, these would move them at different speeds. We kept these variables 
  // just in case we need them for future scrolling logic, though they are currently mapped to the Bento Grid.
  const phoneSlowSpeed = useTransform(phoneScrollProgress, [0,1], ['15%',  '-20%']); 
  const phoneMidSpeed  = useTransform(phoneScrollProgress, [0,1], ['0%',   '-35%']); 
  const phoneFastSpeed = useTransform(phoneScrollProgress, [0,1], ['25%',  '-10%']); 

  /* 
    ── 4. Animation Variants ── 
    These are pre-packaged animation states for Framer Motion.
  */
  // Stagger makes children elements animate one after the other, rather than all at once
  const staggerAnimations = { 
    hidden: {}, 
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } 
  };
  
  // This makes elements slide up from the bottom while fading in and un-blurring
  const slideUpFade = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0a0a0f] overflow-x-hidden transition-colors duration-500">

      {/* ══════════════════════════════════════════
          SECTION 1 — VIDEO HERO (Top of the page)
      ══════════════════════════════════════════ */}
      <section ref={heroSectionRef} className="relative h-[120vh]">
        {/* sticky top-0 keeps this element pinned to the screen as we scroll, creating the parallax wipe effect */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Background Video Layer */}
          {/* We apply the motion values (y and scale) directly to the style prop */}
          <motion.div style={{ y: videoBackgroundY, scale: videoScale }} className="absolute inset-0 z-0 bg-white dark:bg-black">
            <video autoPlay loop muted playsInline
              className="w-full h-full object-cover opacity-60 dark:opacity-40 saturate-[1.2] dark:saturate-100"
              src="/E_commerce_Video_Generation_Request.mp4" />
            
            {/* A gradient overlay to ensure text is readable on top of the video */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/40 to-slate-50 dark:from-[#0a0a0f]/60 dark:via-[#0a0a0f]/10 dark:to-[#0a0a0f]" />
          </motion.div>

          {/* Glowing Orb Layer 1 (Slowest Mouse Movement) */}
          <motion.div style={{ x: orbLayer1X, y: orbLayer1Y }} className="absolute inset-0 z-[1] pointer-events-none">
            <Orb color="rgba(139,92,246,1)"  style={{ width:600, height:600, top:'-8%',   left:'-12%' }} />
            <Orb color="rgba(99,102,241,1)"  style={{ width:480, height:480, bottom:'5%', right:'-10%' }} />
          </motion.div>

          {/* Glowing Orb Layer 2 (Fastest Mouse Movement) */}
          <motion.div style={{ x: orbLayer2X, y: orbLayer2Y }} className="absolute inset-0 z-[1] pointer-events-none">
            <Orb color="rgba(236,72,153,1)"  style={{ width:300, height:300, top:'30%',    right:'12%' }} />
            <Orb color="rgba(251,146,60,1)"  style={{ width:200, height:200, bottom:'22%', left:'18%'  }} />
          </motion.div>

          {/* SVG Noise Grain Overlay (Adds a premium textured look to the background) */}
          <div className="absolute inset-0 z-[2] pointer-events-none opacity-[0.04] dark:opacity-[0.03] mix-blend-multiply dark:mix-blend-normal"
            style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize:'200px' }} />

          {/* Main Hero Text Content */}
          <motion.div style={{ y: textContainerY, opacity: heroTextOpacityFade }}
            className="absolute inset-0 z-10 flex items-center justify-center text-center px-6">
            
            {/* The parent container uses the staggerAnimations to trigger children sequentially */}
            <motion.div variants={staggerAnimations} initial="hidden" animate="show" className="max-w-4xl">

              {/* Subtitle Badge */}
              <motion.div variants={slideUpFade} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                                 bg-black/5 dark:bg-white/8 backdrop-blur-md border border-black/10 dark:border-white/12
                                 text-slate-600 dark:text-white/70 text-xs font-semibold tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
                  Premium Collection 2026
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={slideUpFade}
                className="font-black text-slate-900 dark:text-white leading-[0.93] tracking-tighter mb-6"
                style={{ fontSize:'clamp(3rem,10vw,7.5rem)' }}>
                Wear your{' '}
                <span style={TEXT_GRADIENT}>identity.</span>
              </motion.h1>

              <motion.p variants={slideUpFade}
                className="text-slate-600 dark:text-white/45 text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed">
                Premium device skins crafted from 3M materials — ultra-thin, zero-bulk, and built to last.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={slideUpFade} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                             bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm tracking-wide overflow-hidden
                             shadow-[0_0_40px_rgba(167,139,250,0.25)] dark:shadow-[0_0_40px_rgba(167,139,250,0.35)] hover:shadow-[0_0_60px_rgba(167,139,250,0.4)] dark:hover:shadow-[0_0_60px_rgba(167,139,250,0.55)]
                             transition-all duration-300 hover:scale-[1.03] active:scale-95">
                  <span className="relative z-10">Shop Now</span>
                  <span className="relative z-10"><Arrow /></span>
                  {/* Hover gradient effect for button */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-100 dark:to-pink-100 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link to="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full
                             border border-slate-300 dark:border-white/18 text-slate-700 dark:text-white font-semibold text-sm
                             backdrop-blur-sm bg-white/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors duration-300">
                  Explore Designs
                </Link>
              </motion.div>

            </motion.div>
          </motion.div>

          {/* Scroll Down Hint Animation */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.2,duration:1}}
            style={{opacity: heroTextOpacityFade}} // Fades out with the rest of the text
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
            <span className="text-slate-400 dark:text-white/25 text-[10px] tracking-[0.35em] uppercase">Scroll</span>
            <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:1.6,ease:'easeInOut'}}
              className="w-5 h-8 rounded-full border border-slate-300 dark:border-white/20 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 bg-slate-400 dark:bg-white/45 rounded-full" />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — BENTO SHOWCASE (Professional Grid)
      ══════════════════════════════════════════ */}
      <section ref={phoneSectionRef} className="relative bg-slate-50 dark:bg-[#0a0a0f] py-32 px-4 sm:px-6 z-20 overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}}
            className="mb-20 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end gap-6"
          >
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                Premium Collections
              </span>
              <h2 className="text-slate-900 dark:text-white font-black tracking-tighter text-4xl sm:text-6xl mb-4 leading-[1.1]">
                Engineered for <br/>
                <span style={TEXT_GRADIENT}>perfection.</span>
              </h2>
            </div>
            <p className="text-slate-500 dark:text-white/40 text-lg sm:text-xl font-light max-w-md sm:text-right leading-relaxed">
              Every curve and cutout is meticulously calculated. Explore our signature collections crafted from authentic 3M materials.
            </p>
          </motion.div>

          {/* Grid Container for the Bento Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px] sm:auto-rows-[450px]">
            
            {/* Main Featured Skin (Tanjiro Hanafuda) — Spans 8 columns on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.012, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className="md:col-span-8 relative rounded-[2rem] overflow-hidden
                         bg-white dark:bg-zinc-900/40
                         border border-slate-200 dark:border-white/5
                         group cursor-pointer
                         shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl
                         hover:shadow-[0_25px_60px_-10px_rgba(139,92,246,0.25)] dark:hover:shadow-[0_25px_60px_-10px_rgba(139,92,246,0.35)]
                         hover:border-violet-300 dark:hover:border-violet-500/40
                         transition-[box-shadow,border-color] duration-500"
            >
              {/* Invisible link over the whole card */}
              <Link to="/product/9" className="absolute inset-0 z-20"><span className="sr-only">View Tanjiro Hanafuda Product</span></Link>
              
              {/* Colour wash on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 dark:from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Floating product image */}
              <div className="absolute right-[-15%] sm:right-[-5%] top-[10%] bottom-[-20%] w-[80%] sm:w-[55%] pointer-events-none">
                <img src="/images/skin-tanjiro-hanafuda.png" alt="Tanjiro Hanafuda Earrings Skin"
                  className="w-full h-full object-contain object-bottom
                             drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                             group-hover:scale-[1.07] group-hover:-translate-y-5
                             transition-all duration-700 ease-out" />
              </div>
              {/* Text content */}
              <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 w-full sm:w-[55%] z-10 bg-gradient-to-t from-white/90 sm:from-transparent dark:from-black/80 dark:sm:from-transparent to-transparent">
                <div className="mb-auto">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/10 rounded-full border border-violet-200 dark:border-violet-500/20 backdrop-blur-md">Featured Edition</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Tanjiro Hanafuda</h3>
                <p className="text-slate-600 dark:text-white/50 text-sm sm:text-base leading-relaxed mb-6">Minimalist white skin featuring Tanjiro Kamado's iconic Hanafuda earrings. Precision-cut, zero bulk.</p>
                <div
                  className="inline-flex items-center gap-2 group-hover:gap-4 font-semibold text-sm
                             transition-all duration-300 w-max"
                  style={TEXT_GRADIENT}>
                  View Product <Arrow />
                </div>
              </div>
            </motion.div>

            {/* Side Skin (Marlboro Retro) — Spans 4 columns — Links to Product ID 21 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.018, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className="md:col-span-4 relative rounded-[2rem] overflow-hidden
                         bg-white dark:bg-zinc-900/40
                         border border-slate-200 dark:border-white/5
                         group cursor-pointer flex flex-col
                         shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl
                         hover:shadow-[0_25px_60px_-10px_rgba(251,146,60,0.22)] dark:hover:shadow-[0_25px_60px_-10px_rgba(251,146,60,0.3)]
                         hover:border-orange-300 dark:hover:border-orange-500/40
                         transition-[box-shadow,border-color] duration-500"
            >
              {/* Invisible link over the whole card */}
              <Link to="/product/21" className="absolute inset-0 z-20"><span className="sr-only">View Marlboro Retro Product</span></Link>

              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative flex-grow flex justify-center items-end pt-12 overflow-hidden pointer-events-none">
                <img src="/images/skin-marlboro-retro.png" alt="Marlboro Retro Skin"
                  className="w-[75%] sm:w-[65%] h-auto object-contain translate-y-[15%]
                             drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                             group-hover:-translate-y-4 group-hover:rotate-2 group-hover:scale-105
                             transition-all duration-700 ease-out" />
              </div>
              <div className="relative p-8 z-10 bg-gradient-to-t from-white via-white/90 dark:from-zinc-900 dark:via-zinc-900/80 to-transparent">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Marlboro Retro</h3>
                <p className="text-slate-600 dark:text-white/50 text-sm mt-2">Nostalgia, reinvented for the modern era.</p>
                <div
                  className="inline-flex items-center gap-2 group-hover:gap-4 mt-4 font-semibold text-sm
                             transition-all duration-300"
                  style={TEXT_GRADIENT}>
                  View Product <Arrow />
                </div>
              </div>
            </motion.div>

            {/* Material Highlight Card — Spans 5 columns */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-5 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-100 to-white dark:from-[#111116] dark:to-[#0a0a0f] border border-slate-200 dark:border-white/5 p-8 sm:p-12 flex flex-col justify-between group cursor-pointer shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl"
            >
              {/* Invisible link over the whole card */}
              <Link to="/shop" className="absolute inset-0 z-20"><span className="sr-only">Shop Authentic 3M Materials</span></Link>

              <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-all duration-500">
                  <svg className="w-6 h-6 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Authentic 3M™</h3>
                <p className="text-slate-600 dark:text-white/40 text-sm sm:text-base leading-relaxed">
                  Every skin is crafted from genuine 3M automotive-grade vinyl. Zero residue, perfect grip, and patented air-release channels for a flawless, bubble-free application every single time.
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <div className="h-1 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500" 
                  />
                </div>
              </div>
            </motion.div>

            {/* Wide Skin (Mustang GT) — Spans 7 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.012, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className="md:col-span-7 relative rounded-[2rem] overflow-hidden
                         bg-white dark:bg-zinc-900/40
                         border border-slate-200 dark:border-white/5
                         group cursor-pointer
                         shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] dark:shadow-2xl
                         hover:shadow-[0_25px_60px_-10px_rgba(239,68,68,0.2)] dark:hover:shadow-[0_25px_60px_-10px_rgba(239,68,68,0.3)]
                         hover:border-red-300 dark:hover:border-red-500/40
                         transition-[box-shadow,border-color] duration-500"
            >
              {/* Invisible link over the whole card */}
              <Link to="/product/4" className="absolute inset-0 z-20"><span className="sr-only">View Mustang GT Product</span></Link>

              <div className="absolute inset-0 bg-gradient-to-tl from-red-500/8 dark:from-red-500/12 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute left-[-10%] sm:left-0 top-[10%] bottom-[-20%] w-[70%] sm:w-[50%] pointer-events-none">
                <img src="/images/skin-mustang-gt.png" alt="Mustang GT Skin"
                  className="w-full h-full object-contain object-bottom
                             drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                             group-hover:scale-[1.07] group-hover:-translate-y-5
                             transition-all duration-700 ease-out" />
              </div>
              <div className="relative h-full flex flex-col justify-end items-end text-right p-8 sm:p-12 ml-auto w-full sm:w-[60%] z-10 bg-gradient-to-t from-white/90 sm:from-transparent dark:from-black/80 dark:sm:from-transparent to-transparent">
                <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Mustang GT Racing</h3>
                <p className="text-slate-600 dark:text-white/50 text-sm sm:text-base leading-relaxed max-w-sm mb-6">Classic red Ford Mustang GT with bold white racing stripes. For the true muscle car fan. Built for speed.</p>
                <div
                  className="inline-flex items-center gap-2 group-hover:gap-4 font-semibold text-sm
                             transition-all duration-300"
                  style={TEXT_GRADIENT}>
                  View Product <Arrow />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — IMPACT POSTER (Full width image banner)
      ══════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen bg-slate-50 dark:bg-[#08080d] flex items-center justify-center overflow-hidden transition-colors duration-500">
        <motion.div initial={{scale:1.12}} whileInView={{scale:1}}
          transition={{duration:1.6,ease:[0.22,1,0.36,1]}} viewport={{once:true}}
          className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop"
            alt="Premium MacBook Skin" className="w-full h-full object-cover opacity-20 dark:opacity-35" />
        </motion.div>
        {/* Gradient overlays to darken edges and make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/55 dark:from-[#08080d] dark:via-[#08080d]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/70 via-transparent to-slate-50/70 dark:from-[#08080d]/70 dark:via-transparent dark:to-[#08080d]/70" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
            transition={{duration:0.6}} viewport={{once:true}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
                       bg-black/5 dark:bg-white/8 backdrop-blur-md border border-black/10 dark:border-white/12
                       text-slate-600 dark:text-white/65 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 dark:bg-pink-400" />
            Engineered Perfection
          </motion.div>

          <motion.h2 initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}}
            transition={{duration:0.85,delay:0.1,ease:[0.22,1,0.36,1]}} viewport={{once:true}}
            className="font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-[0.93]"
            style={{fontSize:'clamp(2.8rem,8vw,5.5rem)'}}>
            Precision cut.<br />
            <span style={TEXT_GRADIENT}>
              Flawless fit.
            </span>
          </motion.h2>

          <motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
            transition={{duration:0.8,delay:0.25}} viewport={{once:true}}
            className="text-slate-600 dark:text-white/45 text-lg sm:text-xl mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Crafted from authentic 3M vinyl — razor-cut for your exact device. Zero bulk.
            Scratch-proof. Air-release channels prevent bubbles forever.
          </motion.p>

          <motion.div initial={{opacity:0,scale:0.93}} whileInView={{opacity:1,scale:1}}
            transition={{duration:0.6,delay:0.4}} viewport={{once:true}}>
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-black font-bold py-4 px-10
                         rounded-full text-sm tracking-wide
                         shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.18)]
                         hover:shadow-[0_0_70px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_70px_rgba(255,255,255,0.3)]
                         hover:scale-[1.04] active:scale-95 transition-all duration-300">
              Shop Matte Collection <Arrow />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — BEST SELLERS (Product Grid)
      ══════════════════════════════════════════ */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto relative bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500">
        
        {/* Header row for best sellers */}
        <div className="flex justify-between items-end mb-16">
          <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}}
            transition={{duration:0.7}} viewport={{once:true}}>
            <p className="text-violet-600 dark:text-violet-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">Trending Now</p>
            <h3 className="font-black text-slate-900 dark:text-white tracking-tighter"
              style={{fontSize:'clamp(1.8rem,4vw,2.5rem)'}}>Best Sellers</h3>
            <p className="text-slate-500 dark:text-white/38 mt-2">The designs everyone is talking about.</p>
          </motion.div>
          
          <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}}
            transition={{duration:0.7}} viewport={{once:true}}>
            <Link to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold
                         text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors duration-200 group">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            // Each item links to the exact product page using the real database ID
            // Image src uses the renamed descriptive filenames from /public/images/
            { to:'/product/21', src:'/images/skin-marlboro-retro.png',          name:'Marlboro Retro',        price:'$24.99', badge:'#1 SELLER', delay:0   },
            { to:'/product/8',  src:'/images/skin-demon-slayer-eyes.webp',      name:'Demon Slayer Eyes',     price:'$16.99', badge:'HOT',       delay:0.1 },
            { to:'/product/4',  src:'/images/skin-mustang-racing-stripes.webp', name:'Mustang GT Stripes',    price:'$14.99', badge:'NEW',       delay:0.2 },
          ].map(item => (
            <motion.div key={item.to}
              initial={{opacity:0,y:45}} whileInView={{opacity:1,y:0}}
              transition={{duration:0.7,delay:item.delay,ease:[0.22,1,0.36,1]}} viewport={{once:true}}>
              <Link to={item.to} className="group block">
                
                {/* Product Image Box */}
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900 mb-5 relative border border-slate-200 dark:border-transparent shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] dark:shadow-none">
                  <img src={item.src} alt={item.name}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700 ease-out" />
                  
                  {/* Dark gradient overlay that appears on hover so the Quick View text is readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/55 via-transparent to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-slate-900 text-white dark:bg-white dark:text-black text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest shadow-md">
                    {item.badge}
                  </div>
                  
                  {/* Hover Quick View Button */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-3 opacity-0
                                  group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300
                                  bg-white text-black text-xs font-bold px-5 py-2 rounded-full whitespace-nowrap shadow-xl">
                    Quick View →
                  </div>
                </div>
                
                {/* Product Details (Name and Price) */}
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-base group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors duration-200">{item.name}</h4>
                    <p className="text-slate-500 dark:text-white/35 text-sm mt-0.5">Phone Skin</p>
                  </div>
                  <span className="text-slate-900 dark:text-white font-semibold">{item.price}</span>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Hero;