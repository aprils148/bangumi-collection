'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAnimeChineseTitle } from '../lib/api';

interface DynamicTitleProps {
  defaultTitle?: string;
}

const DynamicTitle: React.FC<DynamicTitleProps> = ({ defaultTitle = '動漫資訊平台 | Bangumi' }) => {
  const pathname = usePathname();

  useEffect(() => {
    const updateTitle = () => {
      // 檢查URL是否包含動漫ID
      const animeMatch = pathname.match(/\/anime\/(\d+)/);
      
      if (animeMatch && animeMatch[1]) {
        const animeId = animeMatch[1];
        const chineseTitle = getAnimeChineseTitle(animeId);
        
        if (chineseTitle) {
          document.title = `${chineseTitle} | Bangumi`;
        } else {
          document.title = defaultTitle;
        }
      } else {
        document.title = defaultTitle;
      }
    };

    updateTitle();
  }, [pathname, defaultTitle]);

  return null; // 這是一個純邏輯組件，不渲染任何內容
};

export default DynamicTitle; 