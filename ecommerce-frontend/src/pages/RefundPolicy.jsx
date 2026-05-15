import React from 'react';
import { motion } from 'framer-motion';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const RefundPolicy = () => {
  return (
    <div className="pt-28 pb-24 px-6 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Legal Information
          </span>
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white mb-4" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Refund <span style={TEXT_GRADIENT}>Policy</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} 
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-8 md:p-12 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl text-slate-700 dark:text-white/70 space-y-6 leading-relaxed">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Returns</h2>
            <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can't offer you a refund or exchange.</p>
            <p className="mt-2">To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Several types of goods are exempt from being returned, such as custom-designed skins.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Refunds (if applicable)</h2>
            <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
            <p className="mt-2">If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Late or missing refunds</h2>
            <p>If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted.</p>
            <p className="mt-2">Next contact your bank. There is often some processing time before a refund is posted. If you've done all of this and you still have not received your refund yet, please contact us at support@skinvault.com.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Exchanges (if applicable)</h2>
            <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at support@skinvault.com and send your item to our designated return address.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Shipping</h2>
            <p>To return your product, you should mail your product to our designated return address. You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
