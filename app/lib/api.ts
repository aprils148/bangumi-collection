import { request, gql } from 'graphql-request';
import animeData from '../../db/anilist-wikidata/wikidata-anime.json';
import { PageResponse, AnimeMedia, MangaMedia } from './api-types';
import { logApiError, logTMDBError } from '../utils/error-logging';

const API_URL = 'https://graphql.anilist.co';

// 獲取wikidata的中文標題
export function getAnimeChineseTitle(id: string | number, lang: 'zh' | 'zh-hant' | 'zh-tw' | 'zh-hk' | 'zh-hans' = 'zh-hant') {
  const idStr = id.toString();
  // @ts-ignore - JSON格式導入但TypeScript無法正確認識
  const anime = animeData[idStr];
  if (!anime || !anime.title) return null;
  
  // 優先使用指定語言的標題，如果沒有則按照優先順序嘗試其他語言版本
  if (anime.title[lang]) return anime.title[lang];
  if (lang === 'zh-hant' && anime.title['zh']) return anime.title['zh'];
  if (lang === 'zh-hant' && anime.title['zh-tw']) return anime.title['zh-tw'];
  if (lang === 'zh-hant' && anime.title['zh-hk']) return anime.title['zh-hk'];
  
  // 其他回退邏輯
  const availableLangs = Object.keys(anime.title);
  if (availableLangs.length > 0) return anime.title[availableLangs[0]];
  
  return null;
}

// 獲取最新的動漫列表
export async function getLatestAnime(page = 1, perPage = 20): Promise<PageResponse> {
  const query = gql`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: [START_DATE_DESC], status: RELEASING) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          duration
          season
          seasonYear
          status
          averageScore
          meanScore
          genres
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error fetching latest anime:', error);
    throw error;
  }
}

// 獲取熱門動漫列表
export async function getPopularAnime(page = 1, perPage = 20): Promise<PageResponse> {
  const query = gql`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: [POPULARITY_DESC]) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          duration
          season
          seasonYear
          status
          averageScore
          meanScore
          genres
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    throw error;
  }
}

// 獲取熱門漫畫列表
export async function getPopularManga(page = 1, perPage = 20): Promise<PageResponse> {
  const query = gql`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: MANGA, sort: [POPULARITY_DESC]) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          chapters
          volumes
          status
          averageScore
          meanScore
          genres
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error fetching popular manga:', error);
    throw error;
  }
}

// 獲取趨勢動漫列表（當前熱門且話題性高的作品）
export async function getTrendingAnime(page = 1, perPage = 20): Promise<PageResponse> {
  const query = gql`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: [TRENDING_DESC, POPULARITY_DESC]) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          duration
          season
          seasonYear
          status
          averageScore
          meanScore
          genres
          trending
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    throw error;
  }
}

// 獲取單個動漫詳細信息
export async function getAnimeDetails(id: number): Promise<AnimeMedia> {
  const query = gql`
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
          extraLarge
        }
        bannerImage
        format
        episodes
        duration
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        season
        seasonYear
        averageScore
        meanScore
        popularity
        favourites
        genres
        tags {
          name
          rank
        }
        studios {
          nodes {
            id
            name
          }
        }
        characters(sort: [ROLE, RELEVANCE, ID]) {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
            role
            voiceActors(language: JAPANESE) {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
              language
            }
          }
        }
        relations {
          edges {
            node {
              id
              title {
                romaji
                native
              }
              format
              type
              coverImage {
                medium
                large
              }
            }
            relationType
          }
        }
        recommendations(sort: [RATING_DESC]) {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                native
              }
              coverImage {
                medium
                large
              }
              format
              type
            }
          }
        }
      }
    }
  `;

  const variables = { id };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Media;
  } catch (error) {
    console.error(`Error fetching anime details for ID ${id}:`, error);
    throw error;
  }
}

// 獲取單個漫畫詳細信息
export async function getMangaDetails(id: number): Promise<MangaMedia> {
  const query = gql`
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
          native
        }
        description
        coverImage {
          large
          medium
          extraLarge
        }
        bannerImage
        format
        chapters
        volumes
        status
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        averageScore
        meanScore
        popularity
        favourites
        genres
        tags {
          name
          rank
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
            role
          }
        }
        characters(sort: [ROLE, RELEVANCE, ID]) {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
            role
          }
        }
        relations {
          edges {
            node {
              id
              title {
                romaji
                native
              }
              format
              type
              coverImage {
                medium
                large
              }
            }
            relationType
          }
        }
        recommendations(sort: [RATING_DESC]) {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                native
              }
              coverImage {
                medium
                large
              }
              format
              type
            }
          }
        }
      }
    }
  `;

  const variables = { id };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Media;
  } catch (error) {
    console.error(`Error fetching manga details for ID ${id}:`, error);
    throw error;
  }
}

// 搜索動漫或漫畫
export async function searchMedia(
  search: string,
  type: 'ANIME' | 'MANGA' | null = null,
  page = 1,
  perPage = 20
): Promise<PageResponse> {
  const query = gql`
    query ($search: String, $type: MediaType, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(search: $search, type: $type) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          chapters
          volumes
          season
          seasonYear
          status
          averageScore
          meanScore
          genres
          type
        }
      }
    }
  `;

  const variables = { search, type, page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error searching media:', error);
    throw error;
  }
}

// 從 AniList ID 獲取 TMDB ID 和中文介紹
export async function getAnimeTMDBDescription(anilistId: string | number): Promise<string | null> {
  try {
    // 第一步：從 ani.zip API 獲取映射資訊
    const anilistIdStr = anilistId.toString();
    const mappingUrl = `https://api.ani.zip/mappings?anilist_id=${anilistIdStr}`;
    
    const mappingsResponse = await fetch(mappingUrl, { next: { revalidate: 3600 } });
    if (!mappingsResponse.ok) {
      logApiError(
        'ani.zip', 
        'fetchMapping', 
        anilistId, 
        `HTTP Error: ${mappingsResponse.status} ${mappingsResponse.statusText}`
      );
      return null;
    }
    
    const mappingsData = await mappingsResponse.json();
    const tmdbId = mappingsData?.mappings?.themoviedb_id;
    
    if (!tmdbId) {
      // 這不是錯誤，只是沒有映射
      console.log(`No TMDB ID found for Anilist ID ${anilistId}`);
      return null;
    }
    
    // 第二步：使用 TMDB ID 獲取中文介紹
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      logApiError('TMDB', 'missingApiKey', anilistId, 'TMDB API key not found in environment variables');
      return null;
    }
    
    // 首先嘗試TV類型
    let tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${tmdbApiKey}&language=zh-TW`,
      { next: { revalidate: 3600 } }
    );
    
    // 如果TV類型請求失敗，嘗試電影類型
    if (!tmdbResponse.ok) {
      console.log(`TV endpoint failed for TMDB ID ${tmdbId}, trying movie endpoint...`);
      tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&language=zh-TW`,
        { next: { revalidate: 3600 } }
      );
      
      // 如果電影類型也請求失敗，記錄錯誤並返回null
      if (!tmdbResponse.ok) {
        logTMDBError(
          anilistId,
          tmdbId,
          'fetchFailed',
          `HTTP Error: Both TV and movie endpoints failed. Status: ${tmdbResponse.status}`
        );
        return null;
      }
    }
    
    const tmdbData = await tmdbResponse.json();
    
    // 返回中文介紹，如果沒有就返回 null
    if (!tmdbData.overview || tmdbData.overview.trim() === '') {
      console.log(`No overview found in TMDB data for ID ${tmdbId}`);
      return null;
    }
    
    return tmdbData.overview;
  } catch (error) {
    logTMDBError(anilistId, null, 'exception', error);
    return null;
  }
}

// 從 AniList ID 獲取其他站點的映射ID
export async function getAnimeMappings(anilistId: string | number): Promise<Record<string, any> | null> {
  try {
    // 從 ani.zip API 獲取映射資訊
    const anilistIdStr = anilistId.toString();
    const mappingUrl = `https://api.ani.zip/mappings?anilist_id=${anilistIdStr}`;
    
    const mappingsResponse = await fetch(mappingUrl, { next: { revalidate: 3600 } });
    if (!mappingsResponse.ok) {
      logApiError(
        'ani.zip', 
        'fetchMapping', 
        anilistId, 
        `HTTP Error: ${mappingsResponse.status} ${mappingsResponse.statusText}`
      );
      return null;
    }
    
    const mappingsData = await mappingsResponse.json();
    
    if (!mappingsData?.mappings) {
      console.log(`No mappings found for Anilist ID ${anilistId}`);
      return null;
    }
    
    // 獲取BangumiTV的ID映射
    try {
      // 動態導入映射文件
      const bangumi_mappings = await import('../../db/anilist-bgmtv-idmapping/anilist-bgmtv-idmapping.json');
      
      // 查找對應的映射
      const mapping = bangumi_mappings.default.find(
        (item: { anilist_id: string; bangumi_id: string }) => 
        item.anilist_id === anilistIdStr
      );
      
      if (mapping) {
        // 將BangumiTV ID添加到映射資料中
        mappingsData.mappings.bangumi_id = mapping.bangumi_id;
      }
    } catch (err) {
      console.error(`Error fetching BangumiTV mapping for Anilist ID ${anilistId}:`, err);
      // 不中斷流程，即使BangumiTV映射失敗，仍返回其他映射
    }
    
    return mappingsData.mappings;
  } catch (error) {
    logApiError('ani.zip', 'fetchMappings', anilistId, error);
    return null;
  }
}

// 從Bangumi.tv獲取動漫簡介
export async function getBangumiDescription(bangumi_id: string | number): Promise<string | null> {
  try {
    if (!bangumi_id) {
      console.error('No Bangumi ID provided');
      return null;
    }

    // 使用Bangumi.tv的API請求動漫資訊
    const bangumiUrl = `https://api.bgm.tv/v0/subjects/${bangumi_id}`;
    
    const response = await fetch(bangumiUrl, { 
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Bangumi Web App'
      },
      next: { revalidate: 86400 } // 一天缓存
    });

    if (!response.ok) {
      console.error(`Failed to fetch Bangumi data: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // 提取簡介信息
    if (data && data.summary) {
      // 導入OpenCC並使用簡繁轉換
      const OpenCC = await import('opencc-js');
      const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
      const convertedSummary = converter(data.summary);
      
      // 記錄日誌以便調試
      console.log(`原始簡介: ${data.summary.substring(0, 50)}...`);
      console.log(`轉換後簡介: ${convertedSummary.substring(0, 50)}...`);
      
      return convertedSummary;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Bangumi description for ID ${bangumi_id}:`, error);
    return null;
  }
}

// 從AniList ID獲取Bangumi.tv簡介
export async function getAnimeBangumiDescription(anilistId: string | number): Promise<string | null> {
  try {
    // 首先獲取Bangumi.tv的ID映射
    const mappings = await getAnimeMappings(anilistId);
    if (!mappings || !mappings.bangumi_id) {
      console.log(`No Bangumi mapping found for Anilist ID ${anilistId}`);
      return null;
    }
    
    // 使用Bangumi ID獲取簡介
    return await getBangumiDescription(mappings.bangumi_id);
  } catch (error) {
    console.error(`Error fetching Bangumi description for Anilist ID ${anilistId}:`, error);
    return null;
  }
}

// 獲取當前季度按星期分類的放送中動漫
export async function getSeasonalAnimeByWeekday(): Promise<Record<string, any[]>> {
  const query = gql`
    query {
      Page(page: 1, perPage: 50) {
        media(type: ANIME, status: RELEASING, sort: [POPULARITY_DESC]) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
            extraLarge
          }
          airingSchedule(notYetAired: true, perPage: 1) {
            nodes {
              airingAt
              episode
            }
          }
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
          format
          episodes
          duration
          season
          seasonYear
          status
          genres
          averageScore
          popularity
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const data: any = await request(API_URL, query);
    const anime = data.Page.media;
    
    // 按星期幾分組
    const animeByWeekday: Record<string, any[]> = {
      '0': [], // 星期日
      '1': [], // 星期一
      '2': [], // 星期二
      '3': [], // 星期三
      '4': [], // 星期四
      '5': [], // 星期五
      '6': [], // 星期六
    };
    
    // 篩選有下一集放送時間的動漫
    anime.filter((anime: any) => anime.nextAiringEpisode).forEach((anime: any) => {
      // 從時間戳獲取星期幾 (0-6, 0 是星期日)
      const airingDate = new Date(anime.nextAiringEpisode.airingAt * 1000);
      const weekday = airingDate.getDay().toString();
      
      // 添加到對應的星期分組
      animeByWeekday[weekday].push({
        ...anime,
        nextAiringDate: airingDate
      });
    });
    
    // 對每個星期的動漫按放送時間排序
    Object.keys(animeByWeekday).forEach((day) => {
      animeByWeekday[day].sort((a, b) => {
        return a.nextAiringDate.getTime() - b.nextAiringDate.getTime();
      });
    });
    
    return animeByWeekday;
  } catch (error) {
    console.error('Error fetching seasonal anime by weekday:', error);
    throw error;
  }
}

// 獲取評分最高的Top100動漫（按分數排序）
export async function getTopRatedAnime(page = 1, perPage = 20): Promise<PageResponse> {
  const query = gql`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: [SCORE_DESC], status_not: NOT_YET_RELEASED) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          episodes
          duration
          season
          seasonYear
          status
          averageScore
          meanScore
          genres
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    throw error;
  }
}

// 獲取評分最高的動漫電影
export async function getTopAnimeMovies(page = 1, perPage = 20): Promise<PageResponse> {
  const query = gql`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: [SCORE_DESC], format: MOVIE, status_not: NOT_YET_RELEASED) {
          id
          title {
            romaji
            native
            english
          }
          description
          coverImage {
            medium
            large
            extraLarge
          }
          bannerImage
          format
          duration
          startDate {
            year
          }
          status
          averageScore
          meanScore
          genres
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const variables = { page, perPage };

  try {
    const data: any = await request(API_URL, query, variables);
    return data.Page;
  } catch (error) {
    console.error('Error fetching top anime movies:', error);
    throw error;
  }
} 