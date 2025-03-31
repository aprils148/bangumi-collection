'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimeCharacterCard } from './AnimeCharacterCard';

interface AnimeCharactersProps {
  characters: {
    edges: any[];
  };
}

export const AnimeCharacters = ({ characters }: AnimeCharactersProps) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!characters || !characters.edges || characters.edges.length === 0) {
    return null;
  }

  const displayCharacters = showAll 
    ? characters.edges 
    : characters.edges.slice(0, 8);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="font-bold text-lg mb-4 border-b pb-2 dark:border-gray-700">角色</h3>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {displayCharacters.map((edge) => (
          <motion.div key={edge.node.id} variants={item}>
            <AnimeCharacterCard character={edge} />
          </motion.div>
        ))}
      </motion.div>
      
      {characters.edges.length > 8 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-light dark:hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded={showAll}
          >
            {showAll ? '收起' : `顯示全部 ${characters.edges.length} 個角色`}
          </button>
        </div>
      )}
    </motion.div>
  );
}; 