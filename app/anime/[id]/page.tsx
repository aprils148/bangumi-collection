import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AnimeCard from '../../components/AnimeCard';
import SiteLinks from '../../components/SiteLinks';
import { getAnimeDetails } from '../../lib/api';
import { getAnimeChineseTitle } from '../../lib/api';
import { getAnimeMappings } from '../../lib/api';
import { getAnimeBangumiDescription } from '../../lib/api';
import { formatUserFriendlyError } from '../../utils/error-logging';
import type { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

// 生成動態元數據（包括標題）
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  // 檢查是否為特殊路由
  if (id === 'latest') {
    return {
      title: '最新動漫 | Bangumi',
      description: '最新上映的動漫作品 - 使用AniList API和維基數據的中文動漫資訊平台',
    };
  }
  
  if (id === 'popular') {
    return {
      title: '熱門動漫 | Bangumi',
      description: '最受歡迎的動漫作品 - 使用AniList API和維基數據的中文動漫資訊平台',
    };
  }
  
  // 驗證ID是否為有效數字
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    return {
      title: '無效的動漫ID | Bangumi',
      description: '無效的動漫ID - 使用AniList API和維基數據的中文動漫資訊平台',
    };
  }
  
  // 從wikidata獲取中文標題
  const chineseTitle = getAnimeChineseTitle(id);
  
  return {
    title: chineseTitle ? `${chineseTitle} | Bangumi` : '動漫詳情 | Bangumi',
    description: '動漫詳細資訊 - 使用AniList API和維基數據的中文動漫資訊平台',
  };
}

async function AnimeDetailPage({ params }: PageProps) {
  try {
    // 檢查是否為特殊路由
    if (params.id === 'latest' || params.id === 'popular') {
      return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-4">正在重定向</h2>
            <p className="mb-6">請使用搜尋功能或返回首頁查找動漫。</p>
            <div className="flex gap-4">
              <Link href="/" className="btn btn-primary">
                返回首頁
              </Link>
              <Link href="/search" className="btn btn-secondary">
                搜尋作品
              </Link>
            </div>
          </div>
          <Footer />
        </>
      );
    }

    // 驗證ID是否為有效數字
    const id = parseInt(params.id);
    if (isNaN(id)) {
      console.error(`無效的動漫ID: ${params.id}`);
      return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-4">無效的動漫ID</h2>
            <p className="mb-6">提供的ID「{params.id}」不是有效的數字。</p>
            <Link href="/" className="btn btn-primary">
              返回首頁
            </Link>
          </div>
          <Footer />
        </>
      );
    }

    // 只有在ID有效時才嘗試獲取詳情
    const animePromise = getAnimeDetails(id);
    // 從wikidata獲取中文標題
    const chineseTitlePromise = getAnimeChineseTitle(id);
    // 從Bangumi.tv獲取中文介紹
    const bangumiDescriptionPromise = getAnimeBangumiDescription(id)
      .catch(error => {
        console.error(`Failed to fetch Bangumi description for anime ID ${id}:`, error);
        return null;
      });
    // 獲取動漫站點映射
    const mappingsPromise = getAnimeMappings(id)
      .catch(error => {
        console.error(`Failed to fetch mappings for anime ID ${id}:`, error);
        return null;
      });
    
    // 等待查詢結果
    const [anime, chineseTitle, bangumiDescription, mappings] = await Promise.all([
      animePromise, 
      chineseTitlePromise, 
      bangumiDescriptionPromise,
      mappingsPromise
    ]);

    if (!anime) {
      return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-4">未找到動漫</h2>
            <p className="mb-6">找不到ID為 {id} 的動漫作品。</p>
            <Link href="/" className="btn btn-primary">
              返回首頁
            </Link>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <Header />

        <div className="mb-8">
          {anime.bannerImage ? (
            <div className="relative h-64 md:h-[28rem] w-full mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
              <Image
                src={anime.bannerImage}
                alt={chineseTitle || anime.title.native}
                fill
                className="object-cover object-center"
                sizes="100vw"
                quality={95}
              />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
                <div className="mb-2 inline-block bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {chineseTitle || anime.title.native}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-black/30 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-lg">
                    {anime.title.native}
                  </span>
                  {anime.averageScore && (
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {(anime.averageScore / 10).toFixed(1)}
                    </span>
                  )}
                  {anime.season && anime.seasonYear && (
                    <span className="bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm">
                      {anime.season === 'WINTER' && '冬季'}
                      {anime.season === 'SPRING' && '春季'}
                      {anime.season === 'SUMMER' && '夏季'}
                      {anime.season === 'FALL' && '秋季'} {anime.seasonYear}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-64 md:h-[28rem] w-full mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-800/90"></div>
              <div className="absolute inset-0 bg-dots-pattern bg-grid-size opacity-10"></div>
              <div className="absolute inset-0 bg-diagonal-pattern bg-grid-size opacity-10 rotate-45"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20">
                <div className="mb-2 inline-block bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {chineseTitle || anime.title.native}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-black/30 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-lg">
                    {anime.title.native}
                  </span>
                  {anime.averageScore && (
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {(anime.averageScore / 10).toFixed(1)}
                    </span>
                  )}
                  {anime.season && anime.seasonYear && (
                    <span className="bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm">
                      {anime.season === 'WINTER' && '冬季'}
                      {anime.season === 'SPRING' && '春季'}
                      {anime.season === 'SUMMER' && '夏季'}
                      {anime.season === 'FALL' && '秋季'} {anime.seasonYear}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-8 pb-8 rounded-xl overflow-hidden">
            {anime.bannerImage && (
              <div className="absolute inset-0 -z-10">
                <Image
                  src={anime.bannerImage}
                  alt=""
                  fill
                  className="object-cover object-center blur-sm opacity-15"
                  sizes="100vw"
                  quality={30}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background-dark/90 to-background-dark/95 backdrop-blur-sm"></div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-8 relative z-10 p-4 sm:p-6">
              <div className="w-full md:w-1/3 lg:w-1/4 animate-fade-in">
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10">
                  <Image
                    src={anime.coverImage.extraLarge || anime.coverImage.large || anime.coverImage.medium}
                    alt={anime.title.native}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    quality={90}
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {anime.format && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">類型:</span>
                      <span className="font-medium">{anime.format}</span>
                    </div>
                  )}
                  {anime.episodes && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">集數:</span>
                      <span className="font-medium">{anime.episodes}</span>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">每集長度:</span>
                      <span className="font-medium">{anime.duration} 分鐘</span>
                    </div>
                  )}
                  {anime.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">狀態:</span>
                      <span className="font-medium">
                        {anime.status === 'RELEASING' && '連載中'}
                        {anime.status === 'FINISHED' && '已完結'}
                        {anime.status === 'NOT_YET_RELEASED' && '未發布'}
                        {anime.status === 'CANCELLED' && '已取消'}
                        {anime.status === 'HIATUS' && '暫停'}
                      </span>
                    </div>
                  )}
                  {anime.season && anime.seasonYear && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">季度:</span>
                      <span className="font-medium">
                        {anime.season === 'WINTER' && '冬季'}
                        {anime.season === 'SPRING' && '春季'}
                        {anime.season === 'SUMMER' && '夏季'}
                        {anime.season === 'FALL' && '秋季'} {anime.seasonYear}
                      </span>
                    </div>
                  )}
                  {anime.averageScore && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">評分:</span>
                      <span className="font-medium text-yellow-400">{anime.averageScore / 10}/10</span>
                    </div>
                  )}
                  {anime.studios && anime.studios.nodes.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">製作:</span>
                      <span className="font-medium">{anime.studios.nodes.map((s: any) => s.name).join(', ')}</span>
                    </div>
                  )}
                </div>

                {anime.genres && anime.genres.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold text-lg mb-2">類別</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre: string) => (
                        <Link 
                          key={genre} 
                          href={`/search?genre=${genre}&type=ANIME`}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/15 transition-colors"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {mappings && (
                  <SiteLinks 
                    mappings={mappings} 
                    className="mt-6 backdrop-blur-sm bg-black/10 p-4 sm:p-5 rounded-lg shadow-lg ring-1 ring-white/10 animate-fade-in" 
                  />
                )}
              </div>

              <div className="w-full md:w-2/3 lg:w-3/4">
                {(bangumiDescription || anime.description) ? (
                  <div className="mb-8 backdrop-blur-sm bg-black/5 p-4 sm:p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-fade-in">
                    <h3 className="font-bold text-lg mb-2">簡介</h3>
                    {bangumiDescription ? (
                      <div className="prose prose-invert max-w-none">
                        {bangumiDescription}
                      </div>
                    ) : (
                      <div 
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: anime.description || '' }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="mb-8 backdrop-blur-sm bg-black/5 p-4 sm:p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-fade-in">
                    <h3 className="font-bold text-lg mb-2">簡介</h3>
                    <div className="prose prose-invert max-w-none text-gray-400 italic">
                      暫無中文簡介。您可以稍後再查看，或者嘗試搜索其他資源獲取相關資訊。
                    </div>
                  </div>
                )}

                {anime.characters && anime.characters.edges.length > 0 && (
                  <div className="mb-8 backdrop-blur-sm bg-black/5 p-4 sm:p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-scale-in">
                    <h3 className="font-bold text-lg mb-4">角色</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {anime.characters.edges.slice(0, 8).map((edge: any) => (
                        <div key={edge.node.id} className="bg-black/20 backdrop-blur-md rounded-lg shadow-md overflow-hidden ring-1 ring-white/5 hover:ring-white/10 transition-all">
                          <div className="flex p-2">
                            <div className="w-16 h-16 flex-shrink-0 mr-2">
                              <div className="relative w-full h-full">
                                <Image
                                  src={edge.node.image.extraLarge || edge.node.image.large || edge.node.image.medium}
                                  alt={edge.node.name.full}
                                  fill
                                  className="object-cover rounded"
                                  sizes="64px"
                                  quality={90}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="font-medium text-sm line-clamp-1">
                                {edge.node.name.native}
                              </span>
                              <span className="text-xs text-gray-300 line-clamp-1">
                                {edge.node.name.full}
                              </span>
                              <span className="text-xs text-primary line-clamp-1">
                                {edge.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {anime.characters.edges.length > 8 && (
                      <div className="mt-2 text-right">
                        <span className="text-primary text-sm">+ {anime.characters.edges.length - 8} 更多角色</span>
                      </div>
                    )}
                  </div>
                )}

                {anime.relations && anime.relations.edges.length > 0 && (
                  <div className="mb-8 backdrop-blur-sm bg-black/5 p-4 sm:p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-slide-in">
                    <h3 className="font-bold text-lg mb-4">相關作品</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {anime.relations.edges.map((edge: any) => {
                        const relatedChineseTitle = getAnimeChineseTitle(edge.node.id);
                        return (
                          <Link 
                            key={edge.node.id} 
                            href={`/${edge.node.type.toLowerCase()}/${edge.node.id}`}
                            className="bg-black/20 backdrop-blur-md rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] ring-1 ring-white/5 hover:ring-white/10"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <Image
                                src={edge.node.coverImage.extraLarge || edge.node.coverImage.large || edge.node.coverImage.medium}
                                alt={relatedChineseTitle || edge.node.title.native || edge.node.title.romaji}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                quality={85}
                              />
                            </div>
                            <div className="p-2">
                              <span className="text-xs text-primary font-medium">
                                {edge.relationType.replace(/_/g, ' ')}
                              </span>
                              <h4 className="font-medium text-sm line-clamp-2">
                                {relatedChineseTitle || edge.node.title.native || edge.node.title.romaji}
                              </h4>
                              <p className="text-xs text-gray-300">
                                {edge.node.format}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {anime.recommendations && anime.recommendations.nodes.length > 0 && (
                  <div className="mb-8 backdrop-blur-sm bg-black/5 p-4 sm:p-6 rounded-lg shadow-lg ring-1 ring-white/10 animate-slide-up">
                    <h3 className="font-bold text-lg mb-4">推薦作品</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {anime.recommendations.nodes.slice(0, 8).map((node: any) => {
                        const rec = node.mediaRecommendation;
                        const recChineseTitle = getAnimeChineseTitle(rec.id);
                        return (
                          <Link 
                            key={rec.id} 
                            href={`/${rec.type.toLowerCase()}/${rec.id}`}
                            className="bg-black/20 backdrop-blur-md rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-[1.02] ring-1 ring-white/5 hover:ring-white/10"
                          >
                            <div className="relative h-40 overflow-hidden">
                              <Image
                                src={rec.coverImage.extraLarge || rec.coverImage.large || rec.coverImage.medium}
                                alt={recChineseTitle || rec.title.native || rec.title.romaji}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 33vw"
                                quality={85}
                              />
                            </div>
                            <div className="p-2">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {recChineseTitle || rec.title.native || rec.title.romaji}
                              </h4>
                              <p className="text-xs text-gray-300">
                                {rec.format}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  } catch (error) {
    console.error(`動漫詳情頁面錯誤 (ID: ${params.id}):`, error);
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-4 text-red-600">載入出錯</h2>
          <p className="mb-6">{formatUserFriendlyError('fetch', '動漫資訊')}</p>
          <div className="flex gap-4">
            <Link href="/" className="btn btn-primary">
              返回首頁
            </Link>
            <Link href="/search" className="btn btn-secondary">
              搜尋作品
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default AnimeDetailPage; 