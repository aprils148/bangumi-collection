// 定義通用的響應類型
export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface MediaTitle {
  romaji: string;
  native: string;
  english?: string;
}

export interface MediaImage {
  medium: string;
  large: string;
  extraLarge?: string;
}

export interface MediaBase {
  id: number;
  title: MediaTitle;
  description?: string;
  coverImage: MediaImage;
  bannerImage?: string;
  format?: string;
  status?: string;
  averageScore?: number;
  meanScore?: number;
  genres?: string[];
  type?: 'ANIME' | 'MANGA';
}

export interface AnimeMedia extends MediaBase {
  episodes?: number;
  duration?: number;
  season?: string;
  seasonYear?: number;
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
  studios?: {
    nodes: { id: number; name: string }[];
  };
  characters?: {
    edges: {
      node: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
      };
      role: string;
      voiceActors?: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
        language?: string;
      }[];
    }[];
  };
  relations?: {
    edges: {
      node: {
        id: number;
        title: {
          romaji: string;
          native: string;
        };
        format: string;
        type: string;
        coverImage: {
          medium: string;
          large: string;
        };
      };
      relationType: string;
    }[];
  };
  recommendations?: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: {
          romaji: string;
          native: string;
        };
        coverImage: {
          medium: string;
          large: string;
        };
        format: string;
        type: string;
      };
    }[];
  };
}

export interface MangaMedia extends MediaBase {
  chapters?: number;
  volumes?: number;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  staff?: {
    edges: {
      node: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
      };
      role: string;
    }[];
  };
  characters?: {
    edges: {
      node: {
        id: number;
        name: {
          full: string;
          native: string;
        };
        image: {
          medium: string;
          large: string;
        };
      };
      role: string;
    }[];
  };
  relations?: {
    edges: {
      node: {
        id: number;
        title: {
          romaji: string;
          native: string;
        };
        format: string;
        type: string;
        coverImage: {
          medium: string;
          large: string;
        };
      };
      relationType: string;
    }[];
  };
  recommendations?: {
    nodes: {
      mediaRecommendation: {
        id: number;
        title: {
          romaji: string;
          native: string;
        };
        coverImage: {
          medium: string;
          large: string;
        };
        format: string;
        type: string;
      };
    }[];
  };
}

export type Media = AnimeMedia | MangaMedia;

export interface PageResponse {
  pageInfo: PageInfo;
  media: Media[];
} 