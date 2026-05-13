import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Device catalogue ──────────────────────────────────────────────────────────
export const DEVICE_CATALOGUE = {
  Apple: {
    color: "#6e6e73",
    models: [
      "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
      "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14",
      "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 Mini",
      "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 Mini",
      "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
      "iPhone SE (3rd Gen)", "iPhone SE (2nd Gen)",
    ],
  },
  Samsung: {
    color: "#1428A0",
    models: [
      "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25",
      "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24",
      "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23",
      "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22",
      "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21",
      "Galaxy S20 FE", "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20",
      "Galaxy A55", "Galaxy A54", "Galaxy A53", "Galaxy A52",
      "Galaxy A35", "Galaxy A34", "Galaxy A33",
      "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Flip 6", "Galaxy Z Flip 5",
    ],
  },
  Motorola: {
    color: "#5C1F9A",
    models: [
      "Edge 50 Ultra", "Edge 50 Pro", "Edge 50",
      "Edge 40 Pro", "Edge 40 Neo", "Edge 40",
      "Edge 30 Ultra", "Edge 30 Pro", "Edge 30",
      "Moto G85", "Moto G84", "Moto G73", "Moto G54",
      "Razr 50 Ultra", "Razr 50", "Razr 40 Ultra",
    ],
  },
  Redmi: {
    color: "#FF6900",
    models: [
      "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13",
      "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12",
      "Redmi Note 11 Pro+", "Redmi Note 11 Pro", "Redmi Note 11",
      "Redmi 13C", "Redmi 12", "Redmi 12C",
      "Poco X6 Pro", "Poco X6", "Poco F6 Pro", "Poco F6", "Poco M6 Pro",
    ],
  },
  OnePlus: {
    color: "#F5010C",
    models: [
      "OnePlus 12", "OnePlus 12R",
      "OnePlus 11", "OnePlus 11R",
      "OnePlus 10 Pro", "OnePlus 10T",
      "OnePlus 9 Pro", "OnePlus 9", "OnePlus 9R",
      "OnePlus Nord 4", "OnePlus Nord CE 4", "OnePlus Nord CE 4 Lite",
      "OnePlus Nord 3", "OnePlus Nord CE 3 Lite",
    ],
  },
  Oppo: {
    color: "#1D7A40",
    models: [
      "Find X8 Pro", "Find X8", "Find X7 Ultra",
      "Reno 12 Pro", "Reno 12", "Reno 11 Pro", "Reno 11",
      "Reno 10 Pro+", "Reno 10 Pro", "Reno 10",
      "A3 Pro", "A3x", "A60", "A78",
    ],
  },
  Vivo: {
    color: "#415FFF",
    models: [
      "X100 Ultra", "X100 Pro", "X100",
      "X90 Pro", "X90", "X80 Pro",
      "V30 Pro", "V30", "V29 Pro", "V29",
      "V27 Pro", "V27", "T3 Ultra", "T3x",
      "Y200 Pro", "Y200", "Y100",
    ],
  },
};

// ── Chevron icon ──────────────────────────────────────────────────────────────
const Chevron = ({ open }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Check icon ────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Single dropdown panel ─────────────────────────────────────────────────────
const DropPanel = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="absolute z-50 top-full left-0 right-0 mt-2
                   bg-white dark:bg-[#18181f]
                   border border-slate-200 dark:border-white/10
                   rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]
                   overflow-hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Main DeviceSelector component ─────────────────────────────────────────────
const DeviceSelector = ({ onChange }) => {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [isAdding, setIsAdding] = useState(true);

  const [currentBrand, setCurrentBrand] = useState(null);
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");

  const brandRef = useRef(null);
  const modelRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setBrandOpen(false);
      if (modelRef.current && !modelRef.current.contains(e.target)) setModelOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleBrandSelect = (brand) => {
    setCurrentBrand(brand);
    setModelSearch("");
    setBrandOpen(false);
    setModelOpen(true);
  };

  const handleModelSelect = (model) => {
    if (selectedDevices.some(d => d.brand === currentBrand && d.model === model)) {
      setModelOpen(false);
      return;
    }

    const newDevices = [...selectedDevices, { brand: currentBrand, model }];
    setSelectedDevices(newDevices);
    onChange(newDevices.map(d => `${d.brand} ${d.model}`));

    setCurrentBrand(null);
    setModelSearch("");
    setModelOpen(false);
    setIsAdding(false);
  };

  const handleRemoveDevice = (index) => {
    const newDevices = selectedDevices.filter((_, i) => i !== index);
    setSelectedDevices(newDevices);
    onChange(newDevices.map(d => `${d.brand} ${d.model}`));
    if (newDevices.length === 0) {
      setIsAdding(true);
    }
  };

  const handleAddAnother = () => {
    setIsAdding(true);
  };

  const brands = Object.keys(DEVICE_CATALOGUE);
  const models = currentBrand
    ? DEVICE_CATALOGUE[currentBrand].models.filter((m) =>
        m.toLowerCase().includes(modelSearch.toLowerCase())
      )
    : [];

  const brandData = currentBrand ? DEVICE_CATALOGUE[currentBrand] : null;

  return (
    <div className="space-y-3">
      {/* Section label */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
          Select Your Device
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/8" />
        <span className="text-[10px] font-semibold text-slate-400 dark:text-white/40">
          {selectedDevices.length}/3
        </span>
      </div>

      <div className="relative">
        <AnimatePresence>
          {isAdding && selectedDevices.length < 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 flex-wrap sm:flex-nowrap mb-3"
            >
              {/* ── Step 1: Brand selector ── */}
              <div ref={brandRef} className="relative flex-1 min-w-[140px]">
                <button
                  type="button"
                  onClick={() => { setBrandOpen((o) => !o); setModelOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold
                              border transition-all duration-200 outline-none
                              ${brandOpen
                                ? "border-violet-500 dark:border-violet-400 ring-2 ring-violet-500/20 dark:ring-violet-400/20"
                                : "border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/60"
                              }
                              bg-white dark:bg-white/5
                              text-slate-800 dark:text-white/80`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {brandData ? (
                      <span>{currentBrand}</span>
                    ) : (
                      <span className="text-slate-400 dark:text-white/30 font-normal">Brand</span>
                    )}
                  </span>
                  <span className="text-slate-400 dark:text-white/30 shrink-0">
                    <Chevron open={brandOpen} />
                  </span>
                </button>

                <DropPanel isOpen={brandOpen}>
                  <div className="p-1.5 max-h-64 overflow-y-auto custom-scroll">
                    {brands.map((brand) => {
                      const isSelected = currentBrand === brand;
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleBrandSelect(brand)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                      transition-all duration-150 text-left group
                                      ${isSelected
                                        ? "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300"
                                        : "text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"
                                      }`}
                        >
                          <span>{brand}</span>
                        </button>
                      );
                    })}
                  </div>
                </DropPanel>
              </div>

              {/* ── Step 2: Model selector ── */}
              <div ref={modelRef} className="relative flex-[1.6] min-w-[160px]">
                <button
                  type="button"
                  disabled={!currentBrand}
                  onClick={() => { setModelOpen((o) => !o); setBrandOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold
                              border transition-all duration-200 outline-none
                              ${!currentBrand
                                ? "opacity-40 cursor-not-allowed border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3"
                                : modelOpen
                                  ? "border-violet-500 dark:border-violet-400 ring-2 ring-violet-500/20 dark:ring-violet-400/20 bg-white dark:bg-white/5"
                                  : "border-slate-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/60 bg-white dark:bg-white/5"
                              }
                              text-slate-800 dark:text-white/80`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-slate-400 dark:text-white/30 font-normal">
                      {currentBrand ? `Choose ${currentBrand} model` : "Select model"}
                    </span>
                  </span>
                  <span className={`shrink-0 ${!currentBrand ? "text-slate-300 dark:text-white/15" : "text-slate-400 dark:text-white/30"}`}>
                    <Chevron open={modelOpen} />
                  </span>
                </button>

                <DropPanel isOpen={modelOpen && !!currentBrand}>
                  <div className="p-2">
                    {/* Search box */}
                    <div className="relative mb-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-white/30"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" strokeWidth="2" />
                        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <input
                        type="text"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        placeholder={`Search ${currentBrand} models…`}
                        className="w-full pl-8 pr-3 py-2.5 text-xs font-medium rounded-lg outline-none
                                   bg-slate-50 dark:bg-white/5
                                   border border-slate-200 dark:border-white/8
                                   text-slate-700 dark:text-white/70
                                   placeholder:text-slate-400 dark:placeholder:text-white/25
                                   focus:border-violet-400 dark:focus:border-violet-500/60 transition-colors"
                      />
                    </div>

                    <div className="max-h-52 overflow-y-auto custom-scroll pr-0.5">
                      {models.length === 0 ? (
                        <p className="text-center text-xs text-slate-400 dark:text-white/25 py-6">
                          No models found
                        </p>
                      ) : (
                        models.map((model) => {
                          const isAlreadySelected = selectedDevices.some(d => d.brand === currentBrand && d.model === model);
                          return (
                            <button
                              key={model}
                              type="button"
                              disabled={isAlreadySelected}
                              onClick={() => handleModelSelect(model)}
                              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm
                                          transition-all duration-150 text-left
                                          ${isAlreadySelected
                                            ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40"
                                            : "text-slate-700 dark:text-white/65 hover:bg-slate-50 dark:hover:bg-white/5 font-medium"
                                          }`}
                            >
                              <span>{model}</span>
                              {isAlreadySelected && (
                                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/30 shrink-0">
                                  Added
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </DropPanel>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Live selection chips ── */}
      <div className="space-y-2 relative z-0">
        <AnimatePresence>
          {selectedDevices.map((device, index) => (
            <motion.div
              key={`${device.brand}-${device.model}`}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, height: 0, marginTop: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl
                         bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-500/10 dark:to-fuchsia-500/8
                         border border-violet-200/70 dark:border-violet-500/20 overflow-hidden"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-500 dark:text-violet-400 mb-0.5">
                  Skin #{index + 1} will be cut for
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-white/85 truncate">
                  {device.brand} {device.model}
                </p>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRemoveDevice(index)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-white/30
                           hover:bg-violet-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white/60
                           transition-colors shrink-0"
                title="Remove selection"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isAdding && selectedDevices.length > 0 && selectedDevices.length < 3 && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          type="button"
          onClick={handleAddAnother}
          className="w-full py-3.5 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl
                     text-sm font-bold text-slate-500 dark:text-white/40
                     hover:border-violet-400 hover:text-violet-600 dark:hover:border-violet-500/50 dark:hover:text-violet-400
                     transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Another Device
        </motion.button>
      )}

      {selectedDevices.length === 3 && (
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-slate-500 dark:text-white/40 text-center font-medium pt-2"
        >
          Maximum of 3 devices reached.
        </motion.p>
      )}
    </div>
  );
};

export default DeviceSelector;
