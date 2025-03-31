import Link from 'next/link';

type SiteLinksProps = {
  mappings: Record<string, any>;
  className?: string;
};

const SiteLinks: React.FC<SiteLinksProps> = ({ mappings, className = '' }) => {
  if (!mappings) return null;
  
  // 需要特殊處理的URL
  const getTMDBUrl = (id: string | number, type: string = 'TV') => {
    // themoviedb_id值可能是電影或電視劇
    if (type === 'MOVIE' || mappings.type === 'MOVIE') {
      return `https://www.themoviedb.org/movie/${id}`;
    }
    return `https://www.themoviedb.org/tv/${id}`;
  };
  
  const sites = [
    {
      id: 'anilist_id',
      name: 'AniList',
      url: (id: string | number) => `https://anilist.co/anime/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h5l13 18h-5L2 3Z"></path>
          <path d="M15 3h5l-5 7"></path>
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'mal_id',
      name: 'MyAnimeList',
      url: (id: string | number) => `https://myanimelist.net/anime/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 5v14h3v-5h2v5h3V5h-3v6H8V5z"></path>
          <path d="M15 5h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-1"></path>
        </svg>
      ),
      color: 'bg-blue-800 hover:bg-blue-900'
    },
    {
      id: 'bangumi_id',
      name: 'BangumiTV',
      url: (id: string | number) => `https://bgm.tv/subject/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"></path>
          <path d="M12 7v4l3 3"></path>
        </svg>
      ),
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      id: 'themoviedb_id',
      name: 'TMDB',
      url: (id: string | number) => getTMDBUrl(id, mappings.type),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="18" rx="2"></rect>
          <path d="M7 7h8"></path>
          <path d="M7 11h10"></path>
          <path d="M7 15h6"></path>
        </svg>
      ),
      color: 'bg-teal-700 hover:bg-teal-800'
    },
    {
      id: 'kitsu_id',
      name: 'Kitsu',
      url: (id: string | number) => `https://kitsu.io/anime/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3L4 13h4v8h8v-8h4L12 3z"></path>
        </svg>
      ),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      id: 'anidb_id',
      name: 'AniDB',
      url: (id: string | number) => `https://anidb.net/anime/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M9 8l6 8"></path>
          <path d="M15 8l-6 8"></path>
        </svg>
      ),
      color: 'bg-gray-700 hover:bg-gray-800'
    },
    {
      id: 'imdb_id',
      name: 'IMDb',
      url: (id: string | number) => `https://www.imdb.com/title/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <path d="M5 10v4"></path>
          <path d="M8 10v4"></path>
          <path d="M11 10v4"></path>
          <path d="M14 10v4"></path>
          <path d="M17 10v4"></path>
        </svg>
      ),
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      id: 'animeplanet_id',
      name: 'Anime-Planet',
      url: (id: string | number) => `https://www.anime-planet.com/anime/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9"></circle>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
      ),
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 'livechart_id',
      name: 'LiveChart',
      url: (id: string | number) => `https://www.livechart.me/anime/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"></path>
          <path d="M7 14l4-4 4 4 6-6"></path>
        </svg>
      ),
      color: 'bg-green-700 hover:bg-green-800'
    },
    {
      id: 'thetvdb_id',
      name: 'TheTVDB',
      url: (id: string | number) => `https://thetvdb.com/series/${id}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2"></rect>
          <path d="M8 21h8"></path>
          <path d="M12 17v4"></path>
        </svg>
      ),
      color: 'bg-purple-700 hover:bg-purple-800'
    }
  ];
  
  const availableSites = sites.filter(site => mappings[site.id]);

  if (availableSites.length === 0) return null;
  
  return (
    <div className={className}>
      <h3 className="font-bold text-lg mb-3">相關網站</h3>
      <div className="flex flex-wrap gap-2">
        {availableSites.map(site => (
          <Link
            key={site.id}
            href={site.url(mappings[site.id])}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-all ${site.color} hover:scale-105`}
            title={`在 ${site.name} 上查看`}
          >
            <span className="text-white">{site.icon}</span>
            <span className="text-sm font-medium">{site.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SiteLinks; 