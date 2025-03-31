'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTitleProps {
  children: ReactNode;
  className?: string;
}

const AnimatedTitle = ({ children, className = '' }: AnimatedTitleProps) => {
  return (
    <motion.h1 
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h1>
  );
};

export default AnimatedTitle; 