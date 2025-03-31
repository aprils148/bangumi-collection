'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { AnimeMedia } from '../lib/api-types';

interface AnimeInfoProps {
  anime: AnimeMedia;
  chineseTitle: string | null;
}

export const AnimeInfo = ({ anime, chineseTitle }: AnimeInfoProps) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-lg overflow-hidden h-[350px] mb-4 shadow-lg group"
      >
        <Image
          src={anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium}
          alt={chineseTitle || anime.title.native}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 300px"
          quality={90}
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
      >
        <h3 className="font-bold text-lg mb-3 border-b pb-2 dark:border-gray-700">資訊</h3>
        <div className="space-y-3 text-sm">
          {anime.format && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">類型:</span>
              <span className="font-medium">{anime.format.replace(/_/g, ' ')}</span>
            </div>
          )}
          {anime.episodes && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">集數:</span>
              <span className="font-medium">{anime.episodes}</span>
            </div>
          )}
          {anime.duration && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">時長:</span>
              <span className="font-medium">{anime.duration} 分鐘</span>
            </div>
          )}
          {anime.status && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">狀態:</span>
              <span className="font-medium">
                {anime.status === 'RELEASING' && '連載中'}
                {anime.status === 'FINISHED' && '已完結'}
                {anime.status === 'NOT_YET_RELEASED' && '未發布'}
                {anime.status === 'CANCELLED' && '已取消'}
                {anime.status === 'HIATUS' && '暫停'}
              </span>
            </div>
          )}
          {anime.season && anime.seasonYear && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">季度:</span>
              <span className="font-medium">
                {anime.season === 'WINTER' && '冬季'}
                {anime.season === 'SPRING' && '春季'}
                {anime.season === 'SUMMER' && '夏季'}
                {anime.season === 'FALL' && '秋季'} {anime.seasonYear}
              </span>
            </div>
          )}
          {anime.averageScore && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">評分:</span>
              <span className="font-medium">{anime.averageScore / 10}/10</span>
            </div>
          )}
          {anime.studios && anime.studios.nodes.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">製作:</span>
              <span className="font-medium">{anime.studios.nodes.map((s) => s.name).join(', ')}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}; 