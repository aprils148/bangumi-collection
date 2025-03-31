'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import Loading from '../components/Loading';
import { getPopularAnime } from '../lib/api';

// 定義動漫數據的接口
interface AnimeData {
  id: number;
  title: {
    romaji: string;
    native: string;
    english: string | null;
  };
  coverImage: {
    medium: string;
    large: string;
  };
  bannerImage?: string;
  episodes?: number;
  meanScore?: number;
  season?: string;
  seasonYear?: number;
  genres?: string[];
  format?: string;
  status?: string;
}

function AnimePage() {
  const [popularAnime, setPopularAnime] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getPopularAnime(1, 12);
        
        if (data && data.media) {
          setPopularAnime(data.media);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('動漫數據獲取錯誤:', err);
        setError('無法獲取熱門動漫數據，請稍後再試');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  if (error && popularAnime.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-red-500 dark:text-red-400">載入出錯</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              重新整理
            </button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <section className="mb-8">
        <div className="relative py-16 px-4 md:px-8 rounded-3xl overflow-hidden mb-10">
          {/* 背景漸變效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 opacity-90"></div>
          
          {/* 背景動畫效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="anime-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#anime-gradient)">
                  <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">動漫專區</h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              發現最優質的動漫作品，盡情探索動漫的無限魅力
            </motion.p>
          </div>
        </div>
        
        {/* 精選動漫類別 */}
        <div className="container mx-auto px-4 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-8 text-center"
          >
            精選動漫分類
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trending 趨勢動漫 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl shadow-lg h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-600 opacity-90 transition-all duration-300 hover:opacity-100"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">趨勢動漫</h3>
                <p className="text-white/80 mb-4">當前最受歡迎和話題性高的動漫作品</p>
                <Link 
                  href="/anime/trending" 
                  className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors inline-flex items-center"
                >
                  查看全部
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* Top 100 評分最高 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl shadow-lg h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600 opacity-90 transition-all duration-300 hover:opacity-100"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">TOP 100</h3>
                <p className="text-white/80 mb-4">評分最高的百大動漫作品</p>
                <Link 
                  href="/anime/top100" 
                  className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors inline-flex items-center"
                >
                  查看全部
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* 動漫電影 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl shadow-lg h-64"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-600 opacity-90 transition-all duration-300 hover:opacity-100"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-8h1V5h-1v2zm0 8h1v-2h-1v2zM9 5h1V3H9v2zm0 8h1v-2H9v2zm-2 0h1v-2H7v2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">動漫電影</h3>
                <p className="text-white/80 mb-4">精彩絕倫的高分動漫電影</p>
                <Link 
                  href="/anime/movies" 
                  className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors inline-flex items-center"
                >
                  查看全部
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 熱門動漫預覽 */}
        <div className="container mx-auto px-4 mb-16">
          <div className="flex justify-between items-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              熱門動漫
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/anime/popular" 
                className="text-gray-600 dark:text-gray-400 font-medium hover:underline flex items-center"
              >
                更多
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {popularAnime.map((anime: AnimeData, index) => (
              <Suspense key={anime.id} fallback={<div className="h-72 bg-gray-800 animate-pulse rounded-xl"></div>}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * index }}
                >
                  <AnimeCard
                    id={anime.id}
                    title={anime.title}
                    coverImage={anime.coverImage}
                    episodes={anime.episodes}
                    meanScore={anime.meanScore}
                    season={anime.season}
                    seasonYear={anime.seasonYear}
                  />
                </motion.div>
              </Suspense>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default AnimePage; 