'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="flex space-x-2">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.5, 1],
            delay: 0
          }}
          className="w-4 h-4 rounded-full bg-primary dark:bg-primary-light"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.5, 1],
            delay: 0.2
          }}
          className="w-4 h-4 rounded-full bg-primary dark:bg-primary-light"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
            times: [0, 0.5, 1],
            delay: 0.4
          }}
          className="w-4 h-4 rounded-full bg-primary dark:bg-primary-light"
        />
      </div>
      <p className="mt-4 text-foreground/70 dark:text-foreground-dark/70 font-medium">載入中，請稍候...</p>
    </div>
  );
} 