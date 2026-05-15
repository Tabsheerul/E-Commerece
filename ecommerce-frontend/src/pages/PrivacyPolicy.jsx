import React from 'react';
import { motion } from 'framer-motion';

const TEXT_GRADIENT = {
  backgroundImage: 'linear-gradient(135deg,#a78bfa 0%,#f472b6 55%,#fb923c 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const PrivacyPolicy = () => {
  return (
    <div className="pt-28 pb-24 px-6 min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-500 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10 text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Legal Information
          </span>
          <h1 className="font-black tracking-tighter text-slate-900 dark:text-white mb-4" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Privacy <span style={TEXT_GRADIENT}>Policy</span>
          </h1>
          <p className="text-slate-500 dark:text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} 
          className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-8 md:p-12 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-xl text-slate-700 dark:text-white/70 space-y-6 leading-relaxed">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us. For example, we collect information when you create an account, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, credit card information and other contact or identifying information you choose to provide.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services. We may also use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Send you technical notices, updates, security alerts and support and administrative messages;</li>
              <li>Respond to your comments, questions and requests and provide customer service;</li>
              <li>Communicate with you about products, services, offers, promotions, rewards, and events offered by SkinVault and others;</li>
              <li>Monitor and analyze trends, usage and activities in connection with our services.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Sharing of Information</h2>
            <p>We may share personal information as follows:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>With vendors, consultants and other service providers who need access to such information to carry out work on our behalf;</li>
              <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation or legal process;</li>
              <li>If we believe your actions are inconsistent with the spirit or language of our user agreements or policies.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Security</h2>
            <p>SkinVault takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@skinvault.com.</p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
