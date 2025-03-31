'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface AnimeGenresProps {
  genres: string[];
}

const AnimeGenres = memo(({ genres }: AnimeGenresProps) => {
  if (!genres || genres.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-4"
    >
      <h3 className="font-bold text-lg mb-3 border-b pb-2 dark:border-gray-700">類別</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Link 
            key={genre} 
            href={`/search?genre=${genre}&type=ANIME`}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
            aria-label={`搜尋${genre}類別的動漫`}
          >
            {genre}
          </Link>
        ))}
      </div>
    </motion.div>
  );
});

AnimeGenres.displayName = 'AnimeGenres';

export default AnimeGenres; 