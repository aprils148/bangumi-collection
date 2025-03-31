'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AnimeCard from '../../components/AnimeCard';
import Loading from '../../components/Loading';
import { getTrendingAnime } from '../../lib/api';

// 定義動漫數據的接口
interface AnimeData {
  id: number;
  title: {
    romaji: string;
    native: string;
    english?: string;
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
  trending?: number;
  genres?: string[];
  format?: string;
  status?: string;
}

function TrendingAnimePage() {
  const [trendingAnime, setTrendingAnime] = useState<AnimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getTrendingAnime(page, 20);
        
        if (data && data.media) {
          setTrendingAnime(prev => page === 1 ? data.media : [...prev, ...data.media]);
          setHasNextPage(data.pageInfo?.hasNextPage || false);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('趨勢動漫數據獲取錯誤:', err);
        setError('無法獲取趨勢動漫數據，請稍後再試');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const loadMoreAnime = () => {
    if (hasNextPage && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  if (error && trendingAnime.length === 0) {
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
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-700 to-red-900 opacity-90"></div>
          
          {/* 背景動畫效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="fire-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#fire-gradient)">
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
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">TRENDING ANIME</h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              當下最熱門的動漫趨勢，關注度最高的作品盡在這裡
            </motion.p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {trendingAnime.map((anime: AnimeData, index) => (
            <Suspense key={anime.id} fallback={<div className="h-96 bg-gray-800 animate-pulse rounded-2xl"></div>}>
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.02 * index }}
              >
                {anime.trending && anime.trending > 100 && (
                  <div className="absolute -top-2 -right-2 z-10 bg-white text-black font-bold px-3 py-1 rounded-xl text-xs flex items-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    熱度 {anime.trending}
                  </div>
                )}
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
        
        {hasNextPage && (
          <div className="flex justify-center mt-8 mb-16">
            <button
              onClick={loadMoreAnime}
              disabled={isLoading}
              className="px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-colors shadow-md flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  載入中...
                </>
              ) : (
                <>
                  載入更多
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </section>
      
      <Footer />
    </>
  );
}

export default TrendingAnimePage; 