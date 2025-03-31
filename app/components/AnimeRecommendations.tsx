'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface AnimeRecommendationsProps {
  recommendations: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: {
          romaji: string;
          native: string;
        };
        coverImage: {
          medium: string;
          large: string;
          extraLarge?: string;
        };
        format: string;
        type: string;
      };
    }[];
  };
}

export const AnimeRecommendations = ({ recommendations }: AnimeRecommendationsProps) => {
  if (!recommendations || !recommendations.nodes || recommendations.nodes.length === 0) {
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
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-8"
    >
      <h3 className="font-bold text-lg mb-4 border-b pb-2 dark:border-gray-700">推薦作品</h3>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        {recommendations.nodes.slice(0, 12).map(({ mediaRecommendation }) => (
          <motion.div key={mediaRecommendation.id} variants={item}>
            <Link
              href={`/${mediaRecommendation.type.toLowerCase()}/${mediaRecommendation.id}`}
              className="block group"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={mediaRecommendation.coverImage.extraLarge || mediaRecommendation.coverImage.large || mediaRecommendation.coverImage.medium}
                  alt={mediaRecommendation.title.native || mediaRecommendation.title.romaji}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 200px"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <p className="text-white text-xs font-medium line-clamp-2">
                    {mediaRecommendation.title.native || mediaRecommendation.title.romaji}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}; 