'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { getAnimeChineseTitle } from '../lib/api';

// 本地函數僅用於檢測標題是否為中文
function isChineseTitle(text: string | null | undefined): boolean {
  if (!text) return false;
  return /[\u4e00-\u9fa5]/.test(text);
}

export interface AnimeCardProps {
  id: number;
  title: {
    romaji: string;
    native: string;
    english: string | null | undefined;
  };
  coverImage: {
    extraLarge?: string;
    large: string;
    medium: string;
  };
  episodes?: number;
  meanScore?: number;
  season?: string;
  seasonYear?: number;
  size?: 'default' | 'small';
  showScore?: boolean;
  subtitle?: string;
  className?: string;
}

function AnimeCard({
  id,
  title,
  coverImage,
  episodes,
  meanScore,
  season,
  seasonYear,
  size = 'default',
  showScore = true,
  subtitle = '',
  className = '',
}: AnimeCardProps) {
  // 優先從API獲取中文標題
  const apiChineseTitle = getAnimeChineseTitle(id);
  
  // 如果API沒有中文標題，但原生標題是中文，則使用原生標題
  const nativeChineseTitle = isChineseTitle(title.native) ? title.native : null;
  
  // 優先使用API中文標題，然後是原生中文標題，然後是其他標題
  const displayTitle = apiChineseTitle || nativeChineseTitle || title.native || title.romaji;
  
  const seasonMap = {
    'WINTER': '冬',
    'SPRING': '春',
    'SUMMER': '夏',
    'FALL': '秋'
  };

  // 根據 size 設定不同尺寸類
  const sizeClasses = {
    default: 'h-[16rem] sm:h-[18rem] md:h-[20rem]',
    small: 'h-[14rem] sm:h-[16rem] md:h-[18rem]'
  };

  return (
    <Link href={`/anime/${id}`}>
      <div
        className={`group relative overflow-hidden rounded-xl bg-background dark:bg-card-dark transition-all duration-300 ease-out ${sizeClasses[size]} 
        hover:shadow-lg hover:-translate-y-1 dark:hover:shadow-black/30 ${className}`}
      >
        {/* 永久性的漸變背景以確保標題始終可讀 */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100" />
        
        {/* 懸停時顯示的額外漸變 */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative h-full w-full overflow-hidden">
          {(coverImage?.extraLarge || coverImage?.large) && (
            <Image
              src={coverImage.extraLarge || coverImage.large}
              alt={displayTitle}
              quality={75}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          )}
          
          {meanScore && showScore && (
            <div className="absolute top-2 right-2 z-20 bg-primary/80 text-white px-2 py-0.5 rounded-md text-sm font-medium shadow-md">
              {meanScore}%
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
            <h3 className="text-white font-semibold line-clamp-2 text-sm drop-shadow-md" title={displayTitle}>
              {displayTitle}
            </h3>
            {subtitle && (
              <p className="text-white/90 text-xs mt-1 line-clamp-1 drop-shadow-md">{subtitle}</p>
            )}
            <div className="flex items-center gap-2 mt-2 transition-opacity duration-300 opacity-80 group-hover:opacity-100">
              {season && seasonYear && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md text-white font-medium backdrop-blur-sm">
                  {season in seasonMap ? seasonMap[season as keyof typeof seasonMap] : season} {seasonYear}
                </span>
              )}
              {episodes && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md text-white font-medium backdrop-blur-sm">
                  {episodes} 集
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 使用優化的 memo 比較函數，只導出一次
export default memo(AnimeCard, (prevProps, nextProps) => {
  // 直接比較 id，如果相同則不重新渲染
  return prevProps.id === nextProps.id;
}); 