'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimeDescriptionProps {
  description: string;
  title: {
    native: string;
    romaji: string;
    english?: string;
  };
  chineseTitle: string | null;
}

export const AnimeDescription = ({ description, title, chineseTitle }: AnimeDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 處理簡介可能過長的情況
  const isLongDescription = description && description.length > 400;
  const displayDescription = isLongDescription && !isExpanded 
    ? description.slice(0, 400) + '...' 
    : description;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="w-full"
    >
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {chineseTitle || title.native}
      </h1>
      <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-6">
        {title.native} 
        {title.english && title.english !== title.native ? ` / ${title.english}` : ''}
      </h2>

      {description && (
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 border-b pb-2 dark:border-gray-700">簡介</h3>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: displayDescription }}
          />
          
          {isLongDescription && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 text-primary dark:text-primary-light hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-2"
              aria-expanded={isExpanded}
            >
              {isExpanded ? '收起' : '展開全部'}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}; 