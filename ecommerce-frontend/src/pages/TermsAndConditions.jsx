import React from 'react';
import { motion } from 'framer-motion';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const TermsAndConditions = () => {
  return (
    <div className="pt-28 pb-24 px-6 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Legal Information
          </span>
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white mb-4" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Terms & <span style={TEXT_GRADIENT}>Conditions</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} 
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-8 md:p-12 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl text-slate-700 dark:text-white/70 space-y-6 leading-relaxed">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Agreement to Terms</h2>
            <p>By viewing or using this website, which can be accessed at SkinVault.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on SkinVault's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose or for any public display;</li>
              <li>attempt to reverse engineer any software contained on SkinVault's Website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Disclaimer</h2>
            <p>All the materials on SkinVault's Website are provided "as is". SkinVault makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, SkinVault does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Limitations</h2>
            <p>SkinVault or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on SkinVault's Website, even if SkinVault or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Revisions and Errata</h2>
            <p>The materials appearing on SkinVault's Website may include technical, typographical, or photographic errors. SkinVault will not promise that any of the materials in this Website are accurate, complete, or current. SkinVault may change the materials contained on its Website at any time without notice. SkinVault does not make any commitment to update the materials.</p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
