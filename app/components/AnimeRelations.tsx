'use client';

import { motion } from 'framer-motion';
import { AnimeRelationCard } from './AnimeRelationCard';

interface AnimeRelationsProps {
  relations: {
    edges: any[];
  };
}

export const AnimeRelations = ({ relations }: AnimeRelationsProps) => {
  if (!relations || !relations.edges || relations.edges.length === 0) {
    return null;
  }

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
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="font-bold text-lg mb-4 border-b pb-2 dark:border-gray-700">相關作品</h3>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        {relations.edges.map((edge) => (
          <motion.div key={`${edge.node.id}-${edge.relationType}`} variants={item}>
            <AnimeRelationCard relation={edge} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}; 