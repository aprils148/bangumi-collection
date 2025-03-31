'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface CarouselItem {
  id: number;
  title: {
    romaji: string;
    native: string;
    english?: string;
  };
  chineseTitle?: string;
  coverImage: {
    large: string;
    medium: string;
    extraLarge?: string;
  };
  bannerImage?: string;
  genres?: string[];
  meanScore?: number;
  description?: string;
  enhancedDescription?: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

// 單獨提取輪播項目組件以優化渲染
const CarouselSlide = memo(({ 
  item, 
  direction, 
  variants, 
  truncateDescription 
}: { 
  item: CarouselItem, 
  direction: number, 
  variants: any,
  truncateDescription: (desc: string, maxLength: number) => string
}) => {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="absolute w-full h-full"
    >
      <div className="relative w-full h-full">
        <Image
          src={item.bannerImage || (item.coverImage?.extraLarge || item.coverImage?.large || item.coverImage?.medium)}
          alt={item.chineseTitle || item.title.native}
          fill
          className="object-cover brightness-[60%] grayscale-[30%]"
          sizes="100vw"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-3 max-w-2xl"
            >
              {item.chineseTitle || item.title.native}
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl font-medium mb-3 text-white/90"
            >
              {item.title.native}
            </motion.p>
            {(item.enhancedDescription || item.description) && (
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm md:text-base text-white/80 mb-4 max-w-2xl line-clamp-3"
              >
                {truncateDescription(item.enhancedDescription || item.description || '', 200)}
              </motion.p>
            )}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {item.genres?.slice(0, 4).map((genre) => (
                <span 
                  key={genre} 
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl text-sm"
                >
                  {genre}
                </span>
              ))}
              {item.meanScore && (
                <span className="bg-white/90 text-black px-3 py-1 rounded-xl text-sm font-medium">
                  {(item.meanScore / 10).toFixed(1)} 分
                </span>
              )}
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link 
                href={`/anime/${item.id}`}
                className="bg-white text-black hover:bg-gray-200 dark:bg-white dark:hover:bg-gray-200 px-6 py-2.5 rounded-xl font-medium transition-colors duration-300 inline-flex items-center shadow-md"
              >
                查看詳情
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CarouselSlide.displayName = 'CarouselSlide';

function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && items.length > 1) {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  // 使用 useMemo 緩存動畫變體定義
  const variants = useMemo(() => ({
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  }), []);

  // 使用 useCallback 優化導航函數
  const navigate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection > 0) {
        return (prevIndex + 1) % items.length;
      }
      return (prevIndex - 1 + items.length) % items.length;
    });
  }, [items.length]);

  // 使用 useCallback 優化暫停和恢復函數
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  // 使用 useCallback 優化描述截斷函數
  const truncateDescription = useCallback((description: string, maxLength: number) => {
    if (!description) return '';
    description = description.replace(/<br\s*\/?>/gi, ' ').replace(/<\/?[^>]+(>|$)/g, '');
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;
  }, []);

  // 使用 useCallback 優化點擊指示器的處理函數
  const handleIndicatorClick = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // 如果沒有項目，不渲染輪播
  if (items.length === 0) {
    return null;
  }

  // 如果只有一個項目，簡化輪播，不需要控制按鈕和指示器
  if (items.length === 1) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
        <CarouselSlide 
          item={items[0]} 
          direction={0} 
          variants={variants} 
          truncateDescription={truncateDescription} 
        />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence initial={false} custom={direction}>
        <CarouselSlide 
          key={currentIndex}
          item={items[currentIndex]} 
          direction={direction} 
          variants={variants}
          truncateDescription={truncateDescription}
        />
      </AnimatePresence>

      {/* 控制按鈕 */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white backdrop-blur-sm transition-colors duration-300"
        onClick={() => navigate(-1)}
        aria-label="上一張"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-white backdrop-blur-sm transition-colors duration-300"
        onClick={() => navigate(1)}
        aria-label="下一張"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 指示器 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-white scale-125' 
                : 'bg-white/40 hover:bg-white/70'
            }`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`顯示第 ${index + 1} 張輪播項目`}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Carousel); 