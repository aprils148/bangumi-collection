'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AnimeCard from '../../components/AnimeCard';
import Loading from '../../components/Loading';
import { getPopularAnime } from '../../lib/api';

// 定義動漫數據的接口
interface AnimeData {
  id: number;
  title: {
    romaji: string;
    native: string;
    english: string | null | undefined;
  };
  coverImage: {
    medium: string;
    large: string;
    extraLarge?: string;
  };
  bannerImage?: string;
  episodes?: number;
  meanScore?: number;
  season?: string;
  seasonYear?: number;
  genres?: string[];
  format?: string;
  status?: string;
  averageScore?: number;
  studios?: {
    nodes: {
      name: string;
    }[];
  };
}

function PopularAnimePage() {
  const [popularAnime, setPopularAnime] = useState<AnimeData[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getPopularAnime(page, 20);
        
        if (data && data.media) {
          // 將 media 數據轉換為 AnimeData 類型
          const formattedMedia = data.media.map((item: any) => ({
            id: item.id,
            title: {
              romaji: item.title.romaji,
              native: item.title.native,
              english: item.title.english
            },
            coverImage: {
              medium: item.coverImage.medium,
              large: item.coverImage.large,
              extraLarge: item.coverImage.extraLarge
            },
            bannerImage: item.bannerImage,
            episodes: item.episodes,
            meanScore: item.meanScore,
            season: item.season,
            seasonYear: item.seasonYear,
            genres: item.genres,
            format: item.format,
            status: item.status,
            averageScore: item.averageScore,
            studios: item.studios
          }));
          
          setPopularAnime(prev => page === 1 ? formattedMedia : [...prev, ...formattedMedia]);
          setHasNextPage(data.pageInfo?.hasNextPage || false);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('熱門動漫數據獲取錯誤:', err);
        setError('無法獲取熱門動漫數據，請稍後再試');
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
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900 via-orange-700 to-orange-800 opacity-90"></div>
          
          {/* 背景動畫效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <radialGradient id="popular-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#popular-gradient)">
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
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wider">熱門動畫</h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              全球最受歡迎的動畫作品，人氣爆棚的經典之作
            </motion.p>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {popularAnime.map((anime: AnimeData, index) => (
              <Suspense key={anime.id} fallback={<div className="h-96 bg-gray-800 animate-pulse rounded-2xl"></div>}>
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.02 * index }}
                >
                  {anime.meanScore && (
                    <div className="absolute -top-2 -right-2 z-10 bg-white text-black font-bold px-3 py-1 rounded-xl text-xs flex items-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {anime.meanScore / 10} 分
                    </div>
                  )}
                  {anime.format && (
                    <div className="absolute top-4 -left-2 z-10 bg-orange-600 text-white px-3 py-1 rounded-r-xl text-xs flex items-center shadow-lg">
                      {anime.format}
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
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default PopularAnimePage; 