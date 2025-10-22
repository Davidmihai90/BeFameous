'use client';
import { motion } from 'framer-motion';

export default function MessageBubble({ text, isSender }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
        isSender
          ? 'bg-gradient-to-r from-[#9333ea] to-[#a855f7] text-white self-end'
          : 'bg-white/10 text-gray-200 self-start'
      }`}
    >
      {text}
    </motion.div>
  );
}
