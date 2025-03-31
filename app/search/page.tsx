import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { searchMedia } from '../lib/api';
import AnimeCard from '../components/AnimeCard';
import Link from 'next/link';
import { PageResponse, Media, AnimeMedia } from '../lib/api-types';
import { getAnimeChineseTitle } from '../lib/api';
import Image from 'next/image';
import { IoSearchOutline } from 'react-icons/io5';
import { MdFilterList } from 'react-icons/md';
import { PiTelevisionSimpleBold, PiBookOpenBold } from 'react-icons/pi';

interface SearchPageProps {
  searchParams: {
    q?: string;
    type?: string;
    genre?: string;
    page?: string;
  };
}

async function SearchResults({ 
  query, 
  type, 
  genre,
  page = 1 
}: { 
  query?: string; 
  type?: string;
  genre?: string; 
  page: number 
}) {
  try {
    if (!query && !genre) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 mb-6 text-gray-300">
            <IoSearchOutline className="w-full h-full" />
          </div>
          <h2 className="text-xl mb-2">請輸入搜尋關鍵字或選擇類別</h2>
          <p className="text-gray-500 max-w-md">
            您可以搜尋動漫名稱、漫畫名稱，或選擇類別進行探索
          </p>
        </div>
      );
    }

    const mediaType = type ? (type as 'ANIME' | 'MANGA') : 'ANIME';
    
    let searchQuery = query || '';
    if (genre) {
      searchQuery = searchQuery ? `${searchQuery} ${genre}` : genre;
    }

    let searchResults: PageResponse | null = null;
    try {
      searchResults = await searchMedia(searchQuery, mediaType, page, 20);
    } catch (error) {
      console.error('搜尋錯誤:', error);
      return (
        <div className="text-center py-16 max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-6">
            <h2 className="text-xl text-red-500 font-bold mb-3">搜尋時發生錯誤</h2>
            <p className="mb-6 text-gray-700">請稍後再試或使用不同的搜尋條件</p>
            <Link href="/search" className="btn btn-primary">
              重置搜尋
            </Link>
          </div>
        </div>
      );
    }

    if (!searchResults) {
      return (
        <div className="text-center py-16 max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-6">
            <h2 className="text-xl text-red-500 font-bold mb-3">無法獲取搜尋結果</h2>
            <p className="mb-6 text-gray-700">請稍後再試</p>
            <Link href="/search" className="btn btn-primary">
              重置搜尋
            </Link>
          </div>
        </div>
      );
    }

    const media = searchResults.media || [];
    const pageInfo = searchResults.pageInfo || {
      total: media.length,
      currentPage: page,
      lastPage: page,
      hasNextPage: false,
      perPage: 20
    };

    if (media.length === 0) {
      return (
        <div className="text-center py-16 max-w-lg mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-6">
            <h2 className="text-xl font-bold mb-3">未找到符合條件的結果</h2>
            <p className="text-gray-700 mb-6">
              嘗試使用不同的關鍵詞或移除部分篩選條件
            </p>
            <Link href="/search" className="btn btn-primary">
              重置搜尋
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fadeIn">
        <div className="mb-8 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-lg font-medium">
            <span className="text-primary">
              找到 {pageInfo.total || media.length} 個結果
            </span>
            {query && <span className="px-2 py-1 rounded-full bg-white/5 text-sm">"{query}"</span>}
            {genre && <span className="px-2 py-1 rounded-full bg-white/5 text-sm">{genre}</span>}
            {type && (
              <span className="px-2 py-1 rounded-full bg-white/5 text-sm flex items-center gap-1">
                {type === 'ANIME' ? (
                  <>
                    <PiTelevisionSimpleBold className="inline" />
                    <span>動畫</span>
                  </>
                ) : (
                  <>
                    <PiBookOpenBold className="inline" />
                    <span>漫畫</span>
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {media.map((item: Media, index: number) => {
            const title = {
              romaji: item.title.romaji,
              native: item.title.native,
              english: item.title.english || null,
              chinese: getAnimeChineseTitle(item.id)
            };
            
            if (item.type === 'ANIME') {
              const animeItem = item as AnimeMedia;
              return (
                <AnimeCard
                  key={animeItem.id}
                  id={animeItem.id}
                  title={title}
                  coverImage={animeItem.coverImage}
                  episodes={animeItem.episodes}
                  meanScore={animeItem.meanScore}
                  season={animeItem.season}
                  seasonYear={animeItem.seasonYear}
                />
              );
            } else {
              return (
                <AnimeCard
                  key={item.id}
                  id={item.id}
                  title={title}
                  coverImage={item.coverImage}
                  meanScore={item.meanScore}
                />
              );
            }
          })}
        </div>

        {/* 分頁控制 */}
        {pageInfo.total && pageInfo.total > 20 && (
          <div className="flex justify-center mt-12 mb-4">
            <div className="flex items-center space-x-2 bg-black/30 p-1 rounded-xl backdrop-blur-sm">
              {pageInfo.currentPage > 1 && (
                <Link
                  href={`/search?q=${query || ''}&type=${type || ''}&genre=${
                    genre || ''
                  }&page=${pageInfo.currentPage - 1}`}
                  className="py-2 px-4 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  上一頁
                </Link>
              )}
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pageInfo.lastPage) }, (_, i) => {
                  // 計算要顯示的頁碼範圍
                  let pageNum;
                  if (pageInfo.lastPage <= 5) {
                    pageNum = i + 1;
                  } else if (pageInfo.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pageInfo.currentPage >= pageInfo.lastPage - 2) {
                    pageNum = pageInfo.lastPage - 4 + i;
                  } else {
                    pageNum = pageInfo.currentPage - 2 + i;
                  }
                  
                  return (
                    <Link
                      key={pageNum}
                      href={`/search?q=${query || ''}&type=${type || ''}&genre=${
                        genre || ''
                      }&page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                        pageInfo.currentPage === pageNum
                          ? 'bg-primary text-white'
                          : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>
              
              {pageInfo.hasNextPage && (
                <Link
                  href={`/search?q=${query || ''}&type=${type || ''}&genre=${
                    genre || ''
                  }&page=${pageInfo.currentPage + 1}`}
                  className="py-2 px-4 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  下一頁
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('搜尋處理錯誤:', error);
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-6">
          <h2 className="text-xl text-red-500 font-bold mb-3">搜尋時發生未知錯誤</h2>
          <p className="mb-6 text-gray-700">請稍後再試或使用不同的搜尋條件</p>
          <Link href="/search" className="btn btn-primary">
            重置搜尋
          </Link>
        </div>
      </div>
    );
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const type = searchParams.type || 'ANIME';
  const genre = searchParams.genre || '';
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // 定義用於分類選項的映射
  const genreOptions = [
    { value: "Action", label: "動作" },
    { value: "Adventure", label: "冒險" },
    { value: "Comedy", label: "喜劇" },
    { value: "Drama", label: "劇情" },
    { value: "Fantasy", label: "奇幻" },
    { value: "Horror", label: "恐怖" },
    { value: "Mystery", label: "懸疑" },
    { value: "Romance", label: "愛情" },
    { value: "Sci-Fi", label: "科幻" },
    { value: "Slice of Life", label: "日常" },
    { value: "Sports", label: "運動" },
    { value: "Supernatural", label: "超自然" },
    { value: "Thriller", label: "驚悚" }
  ];

  return (
    <div className="min-h-screen modern-dark-blue-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mb-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-gradient">探索動漫世界</h1>

        <div className="max-w-4xl mx-auto mb-12">
          <form action="/search" method="GET" className="glass border border-white/20 p-6 rounded-2xl shadow-xl mb-8">
            <div className="flex flex-col space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  name="q"
                  defaultValue={query}
                  placeholder="輸入動漫、漫畫名稱或關鍵詞"
                  className="input pl-10 h-12 text-lg"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MdFilterList className="text-primary" />
                    <span className="text-sm font-medium text-white/80">篩選條件</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select id="type" name="type" defaultValue={type || 'ANIME'} className="input h-12">
                        <option value="ANIME">動畫</option>
                        <option value="MANGA">漫畫</option>
                      </select>
                    </div>
                    
                    <div>
                      <select id="genre" name="genre" defaultValue={genre} className="input h-12">
                        <option value="">全部類別</option>
                        {genreOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="md:self-end">
                  <button type="submit" className="btn btn-primary h-12 w-full md:w-auto px-8">
                    <span className="flex items-center gap-2">
                      <IoSearchOutline className="h-5 w-5" />
                      搜尋
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* 熱門標籤快捷方式 */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {genreOptions.slice(0, 8).map(option => (
              <Link 
                key={option.value} 
                href={`/search?genre=${option.value}&type=ANIME`}
                className="px-4 py-2 bg-white/5 hover:bg-primary/80 rounded-full text-sm transition-colors hover:text-white"
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <Suspense fallback={
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-4 text-gray-400">正在搜尋中...</p>
          </div>
        }>
          <SearchResults query={query} type={type} genre={genre} page={page} />
        </Suspense>
      </div>
      
      <Footer />
    </div>
  );
}