import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getSeasonalAnimeByWeekday } from '../lib/api';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 使用動態導入來加載客戶端組件
const AiringSchedule = dynamic(() => import('../components/AiringSchedule'), { ssr: true });
const AnimatedTitle = dynamic(() => import('../components/AnimatedTitle'), { ssr: true });

export const metadata: Metadata = {
  title: '動漫放送表 | Bangumi',
  description: '每週動漫放送時間表 - 查看本季度正在放送的動漫作品',
};

export default async function AiringSchedulePage() {
  const animeByWeekday = await getSeasonalAnimeByWeekday();

  // 預處理時間格式，而不是傳遞函數
  const processedAnimeByWeekday: Record<string, any[]> = {};
  
  Object.entries(animeByWeekday).forEach(([weekday, animeList]) => {
    processedAnimeByWeekday[weekday] = animeList.map(anime => {
      // 將Date對象轉換為ISO字符串，客戶端可以重新構建
      const nextAiringDateISO = anime.nextAiringDate.toISOString();
      
      // 預格式化時間
      const formattedTime = anime.nextAiringDate.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // 返回處理後的數據
      return {
        ...anime,
        nextAiringDateISO,
        formattedTime
      };
    });
  });

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 mb-16">
        <AnimatedTitle className="text-3xl md:text-4xl font-bold text-center mb-8">
          本季度動漫放送表
        </AnimatedTitle>
        
        <Suspense fallback={<div className="text-center py-20">載入放送表...</div>}>
          <AiringSchedule animeByWeekday={processedAnimeByWeekday} />
        </Suspense>
      </div>
      <Footer />
    </>
  );
} 