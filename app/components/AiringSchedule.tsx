'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

// 星期幾對應的中文名稱
const weekdayNames: Record<string, string> = {
  '0': '星期日',
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六'
};

interface AnimeItem {
  id: number;
  title: {
    romaji: string;
    native: string;
    english: string | null;
  };
  coverImage: {
    extraLarge?: string;
    large?: string;
    medium?: string;
  };
  nextAiringEpisode: {
    episode: number;
  };
  nextAiringDateISO: string; // ISO 字符串形式的日期
  formattedTime: string; // 預先格式化的時間
  studios?: {
    nodes?: {
      name: string;
    }[];
  };
}

type AiringScheduleProps = {
  animeByWeekday: Record<string, AnimeItem[]>;
};

const AiringSchedule = ({ animeByWeekday }: AiringScheduleProps) => {
  // 使用 useMemo 緩存結果
  const processedData = useMemo(() => {
    return Object.entries(animeByWeekday).map(([weekday, animeList]) => {
      return {
        weekday,
        displayName: weekdayNames[weekday],
        animeList
      };
    });
  }, [animeByWeekday]);

  return (
    <div className="space-y-12">
      {processedData.map(({ weekday, displayName, animeList }) => (
        <motion.section 
          key={weekday}
          className="rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: Number(weekday) * 0.1 }}
        >
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-t-lg border-b border-white/10">
            <h2 className="text-2xl font-bold">{displayName}</h2>
            <p className="text-gray-400">共 {animeList.length} 部作品</p>
          </div>

          {animeList.length > 0 ? (
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-b-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {animeList.map((anime) => (
                <Link 
                  href={`/anime/${anime.id}`} 
                  key={anime.id}
                  className="group"
                >
                  <motion.div 
                    className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:scale-[1.02]"
                    whileHover={{ y: -5 }}
                  >
                    <Image
                      src={anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium || ''}
                      alt={anime.title.native || anime.title.romaji}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent h-1/2 flex flex-col justify-end p-3">
                      <div className="text-xs text-white/80 mb-1">
                        {anime.formattedTime} · EP {anime.nextAiringEpisode.episode}
                      </div>
                      <h3 className="text-sm font-bold line-clamp-2">
                        {anime.title.native || anime.title.romaji}
                      </h3>
                      <div className="text-xs text-white/60 line-clamp-1 mt-1">
                        {anime.studios?.nodes?.length ? anime.studios.nodes[0].name : 'Unknown Studio'}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-b-lg text-center py-8 text-gray-400">
              沒有在{displayName}放送的動漫
            </div>
          )}
        </motion.section>
      ))}
    </div>
  );
};

export default AiringSchedule; 