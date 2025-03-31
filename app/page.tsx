'use client';

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimeCard from './components/AnimeCard';
import Loading from './components/Loading';
import Carousel from './components/Carousel';
import { getPopularAnime, getTrendingAnime, getSeasonalAnimeByWeekday, getAnimeChineseTitle, getAnimeBangumiDescription } from './lib/api';
import { AnimeMedia } from './lib/api-types';
import { useInView } from 'react-intersection-observer';

// 額外的類型，用於擴展API返回的類型
interface TrendingAnimeMedia extends AnimeMedia {
  trending?: number;
}

function HomePage() {
  const [popularAnime, setPopularAnime] = useState<AnimeMedia[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<TrendingAnimeMedia[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<AnimeMedia[]>([]);
  const [airingAnime, setAiringAnime] = useState<{[key: string]: AnimeMedia[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
  
  // 使用 IntersectionObserver 懶加載
  const [trendingRef, trendingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [popularRef, popularInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [airingRef, airingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // 使用 useMemo 緩存星期名稱，避免重複創建
  const weekdayNames = useMemo(() => ({
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  }), []);

  // 使用 useCallback 封裝事件處理函數
  const handleDayChange = useCallback((day: number) => {
    setCurrentDay(day);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 同時獲取熱門、趨勢和放送表動漫數據
        const [popularAnimeData, trendingAnimeData, airingAnimeData] = await Promise.all([
          getPopularAnime(1, 12),
          getTrendingAnime(1, 12),
          getSeasonalAnimeByWeekday()
        ]);

        setPopularAnime(popularAnimeData.media || []);
        setTrendingAnime(trendingAnimeData.media as TrendingAnimeMedia[] || []);
        setAiringAnime(airingAnimeData || {});

        // 為輪播選擇前5個熱門動漫，且必須有橫幅圖片
        const featured = (trendingAnimeData.media || [])
          .filter((anime: AnimeMedia) => anime.bannerImage || anime.coverImage.large)
          .slice(0, 5);
        
        // 為輪播項目添加中文標題和 bgm.tv 簡介
        const enhancedFeatured = await Promise.all(
          featured.map(async (anime: AnimeMedia) => {
            // 獲取中文標題
            const chineseTitle = getAnimeChineseTitle(anime.id);
            
            // 獲取 bgm.tv 簡介
            const bangumiDesc = await getAnimeBangumiDescription(anime.id);
            
            return {
              ...anime,
              chineseTitle: chineseTitle || anime.title.native,
              enhancedDescription: bangumiDesc || anime.description
            };
          })
        );
        
        setFeaturedAnime(enhancedFeatured);
        setIsLoading(false);
      } catch (err) {
        console.error('首頁數據獲取錯誤:', err);
        setError('無法獲取動漫數據，請稍後再試');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 使用 useMemo 優化渲染列表
  const trendingAnimeList = useMemo(() => {
    return trendingAnime.map((anime: TrendingAnimeMedia, index) => (
      <Suspense key={anime.id} fallback={<div className="h-[14rem] sm:h-[16rem] bg-gray-800/40 animate-pulse rounded-xl"></div>}>
        <div 
          className="relative opacity-0 translate-y-4 animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index, 3) * 50}ms` }}
        >
          {anime.trending && anime.trending > 100 && (
            <div className="absolute -top-2 -right-2 z-10 bg-white text-black font-bold px-2 py-0.5 rounded-xl text-xs flex items-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              熱度 {anime.trending}
            </div>
          )}
          <div className="transform scale-95 origin-top">
            <AnimeCard
              id={anime.id}
              title={{
                romaji: anime.title.romaji,
                native: anime.title.native,
                english: anime.title.english || null
              }}
              coverImage={anime.coverImage}
              episodes={anime.episodes}
              meanScore={anime.meanScore}
              season={anime.season}
              seasonYear={anime.seasonYear}
              size="small"
            />
          </div>
        </div>
      </Suspense>
    ));
  }, [trendingAnime]);

  // 使用 useMemo 優化渲染列表
  const popularAnimeList = useMemo(() => {
    return popularAnime.map((anime: AnimeMedia, index) => (
      <Suspense key={anime.id} fallback={<div className="h-[14rem] sm:h-[16rem] bg-gray-100/40 dark:bg-gray-800/40 animate-pulse rounded-xl"></div>}>
        <div 
          className="relative opacity-0 translate-y-4 animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index, 3) * 50}ms` }}
        >
          <div className="transform scale-95 origin-top">
            <AnimeCard
              id={anime.id}
              title={{
                romaji: anime.title.romaji,
                native: anime.title.native,
                english: anime.title.english || null
              }}
              coverImage={anime.coverImage}
              episodes={anime.episodes}
              meanScore={anime.meanScore}
              season={anime.season}
              seasonYear={anime.seasonYear}
              size="small"
            />
          </div>
        </div>
      </Suspense>
    ));
  }, [popularAnime]);

  // 使用 useMemo 優化放送表渲染
  const airingAnimeList = useMemo(() => {
    if (!airingAnime[currentDay] || airingAnime[currentDay].length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-2 text-center">這一天沒有動漫放送</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">可以嘗試選擇其他日期查看</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {airingAnime[currentDay].slice(0, 12).map((anime, index) => {
          // 獲取中文標題
          const chineseTitle = getAnimeChineseTitle(anime.id);
          const displayTitle = chineseTitle || anime.title.native || anime.title.romaji;
          
          return (
            <div
              key={anime.id}
              className="opacity-0 translate-y-4 animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index, 3) * 50}ms` }}
            >
              <Link href={`/anime/${anime.id}`} className="block relative group">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-2">
                  <img
                    src={anime.coverImage.large || anime.coverImage.medium}
                    alt={displayTitle}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* 漸變背景確保所有文字可讀 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  {anime.nextAiringEpisode && (
                    <div className="absolute top-0 right-0 bg-primary dark:bg-primary-light text-white px-2 py-1 text-xs rounded-bl-lg font-medium shadow-md z-10">
                      第 {anime.nextAiringEpisode.episode} 集
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {displayTitle}
                </h3>
                {anime.nextAiringEpisode && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleTimeString('zh-TW', {
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false
                    })}
                  </p>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    );
  }, [airingAnime, currentDay]);

  // 根據weekdayNames生成日期選擇按鈕
  const weekdayButtons = useMemo(() => {
    return Object.entries(weekdayNames).map(([day, name]) => (
      <button
        key={day}
        onClick={() => handleDayChange(parseInt(day))}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
          parseInt(day) === currentDay
            ? 'bg-primary text-white dark:bg-primary-light'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {name}
      </button>
    ));
  }, [weekdayNames, currentDay, handleDayChange]);

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  }

  if (error) {
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
      
      {featuredAnime.length > 0 && (
        <div className="mb-10">
          <Carousel items={featuredAnime} />
        </div>
      )}
      
      <section ref={trendingRef} className="mb-16 relative py-10 px-4 md:px-8 rounded-3xl overflow-hidden bg-transparent">
        {/* 背景底色 */}
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark relative tracking-wider">
                TRENDING
                <span className="ml-2 text-sm font-normal opacity-80">當前最熱門趨勢</span>
              </h2>
            </div>
            <div>
              <Link 
                href="/anime/trending" 
                className="text-foreground dark:text-foreground-dark font-medium hover:underline flex items-center px-3 py-1.5 bg-white/10 dark:bg-white/5 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm"
              >
                查看全部
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {trendingAnimeList}
          </div>
        </div>
      </section>
      
      {/* 每週放送表部分 */}
      <section ref={airingRef} className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-primary dark:text-primary-light" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark relative">
              每週放送表
              <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary dark:bg-primary-light rounded-full"></div>
            </h2>
          </div>
          <div>
            <Link 
              href="/airing" 
              className="text-foreground dark:text-foreground-dark font-medium hover:underline flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              完整放送表
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mb-4 flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {weekdayButtons}
        </div>

        <div className="glass p-6 rounded-2xl">
          {airingAnimeList}
        </div>
      </section>
      
      <section ref={popularRef} className="mb-16 relative py-10 px-4 md:px-8 rounded-3xl overflow-hidden bg-transparent">
        {/* 背景底色 */}
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark relative tracking-wider">
                熱門動漫
                <span className="ml-2 text-sm font-normal opacity-80">全球最受歡迎</span>
              </h2>
            </div>
            <div>
              <Link 
                href="/anime/popular" 
                className="text-foreground dark:text-foreground-dark font-medium hover:underline flex items-center px-3 py-1.5 bg-white/10 dark:bg-white/5 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-sm"
              >
                查看全部
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {popularAnimeList}
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-light to-primary-dark dark:from-primary-dark dark:via-primary dark:to-primary-light p-8 md:p-12 text-white opacity-0 translate-y-4 animate-fade-in-up"
        >
          <div className="absolute inset-0">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
              <rect fill="none" strokeOpacity="0.1" stroke="currentColor" strokeWidth="2" x="0" y="0" width="100%" height="100%" strokeDasharray="12,40" strokeLinecap="round" />
              <rect fill="none" strokeOpacity="0.1" stroke="currentColor" strokeWidth="2" x="100" y="100" width="80%" height="80%" strokeDasharray="12,40" strokeLinecap="round" />
              <rect fill="none" strokeOpacity="0.1" stroke="currentColor" strokeWidth="2" x="200" y="200" width="60%" height="60%" strokeDasharray="12,40" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">探索更多動漫世界</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl">在我們的平台上發現更多有趣的動漫作品和漫畫，成為您的動漫資訊中心！</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/anime" className="btn bg-white text-primary hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                瀏覽動畫
              </Link>
              <Link href="/manga" className="btn bg-secondary text-white hover:bg-secondary-light transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                瀏覽漫畫
              </Link>
              <Link href="/search" className="btn bg-accent text-foreground hover:bg-accent-dark transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                搜尋作品
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}

export default HomePage; 