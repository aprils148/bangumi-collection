import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getMangaDetails } from '../../lib/api';

interface PageProps {
  params: {
    id: string;
  };
}

async function MangaDetailPage({ params }: PageProps) {
  try {
    const id = parseInt(params.id);
    const manga = await getMangaDetails(id);

    if (!manga) {
      return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-4">未找到漫畫</h2>
            <p className="mb-6">找不到ID為 {id} 的漫畫作品。</p>
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
          {manga.bannerImage && (
            <div className="relative h-64 md:h-80 w-full mb-8 overflow-hidden rounded-lg">
              <Image
                src={manga.bannerImage}
                alt={manga.title.romaji}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="relative overflow-hidden rounded-lg shadow-xl">
                <Image
                  src={manga.coverImage.extraLarge || manga.coverImage.large || manga.coverImage.medium}
                  alt={manga.title.native || manga.title.romaji}
                  width={300}
                  height={450}
                  className="w-full object-cover"
                  priority
                />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="font-bold text-lg mb-2">資訊</h3>
                <div className="space-y-2 text-sm">
                  {manga.format && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">類型:</span>
                      <span>{manga.format.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {manga.chapters && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">章節:</span>
                      <span>{manga.chapters}</span>
                    </div>
                  )}
                  {manga.volumes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">卷數:</span>
                      <span>{manga.volumes}</span>
                    </div>
                  )}
                  {manga.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">狀態:</span>
                      <span>
                        {manga.status === 'RELEASING' && '連載中'}
                        {manga.status === 'FINISHED' && '已完結'}
                        {manga.status === 'NOT_YET_RELEASED' && '未發布'}
                        {manga.status === 'CANCELLED' && '已取消'}
                        {manga.status === 'HIATUS' && '暫停'}
                      </span>
                    </div>
                  )}
                  {manga.startDate && manga.startDate.year && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">開始連載:</span>
                      <span>
                        {manga.startDate.year}年
                        {manga.startDate.month && `${manga.startDate.month}月`}
                        {manga.startDate.day && `${manga.startDate.day}日`}
                      </span>
                    </div>
                  )}
                  {manga.averageScore && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">評分:</span>
                      <span>{manga.averageScore / 10}/10</span>
                    </div>
                  )}
                </div>
              </div>

              {manga.genres && manga.genres.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-2">類別</h3>
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre: string) => (
                      <Link 
                        key={genre} 
                        href={`/search?genre=${genre}&type=MANGA`}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="mt-6">
                <h1 className="text-2xl font-bold mb-2">{manga.title.native}</h1>
                <h2 className="text-xl text-gray-700 mb-4">{manga.title.native}</h2>
              </div>

              {manga.description && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-2">簡介</h3>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: manga.description }}
                  />
                </div>
              )}

              {manga.staff && manga.staff.edges.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">製作人員</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {manga.staff.edges.slice(0, 8).map((edge: any) => (
                      <div key={edge.node.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex p-2">
                          <div className="w-16 h-16 flex-shrink-0 mr-2">
                            <div className="relative w-full h-full">
                              <Image
                                src={edge.node.image.large || edge.node.image.medium}
                                alt={edge.node.name.full}
                                fill
                                className="object-cover rounded"
                                sizes="64px"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="font-medium text-sm line-clamp-1">
                              {edge.node.name.native}
                            </span>
                            <span className="text-xs text-gray-500 line-clamp-1">
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
                  {manga.staff.edges.length > 8 && (
                    <div className="mt-2 text-right">
                      <span className="text-primary text-sm">+ {manga.staff.edges.length - 8} 更多製作人員</span>
                    </div>
                  )}
                </div>
              )}

              {manga.characters && manga.characters.edges.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">角色</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {manga.characters.edges.slice(0, 8).map((edge: any) => (
                      <div key={edge.node.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex p-2">
                          <div className="w-16 h-16 flex-shrink-0 mr-2">
                            <div className="relative w-full h-full">
                              <Image
                                src={edge.node.image.large || edge.node.image.medium}
                                alt={edge.node.name.full}
                                fill
                                className="object-cover rounded"
                                sizes="64px"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="font-medium text-sm line-clamp-1">
                              {edge.node.name.native}
                            </span>
                            <span className="text-xs text-gray-500 line-clamp-1">
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
                  {manga.characters.edges.length > 8 && (
                    <div className="mt-2 text-right">
                      <span className="text-primary text-sm">+ {manga.characters.edges.length - 8} 更多角色</span>
                    </div>
                  )}
                </div>
              )}

              {manga.relations && manga.relations.edges.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">相關作品</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {manga.relations.edges.map((edge: any) => (
                      <Link 
                        key={edge.node.id} 
                        href={`/${edge.node.type.toLowerCase()}/${edge.node.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                          <Image
                            src={edge.node.coverImage.extraLarge || edge.node.coverImage.large || edge.node.coverImage.medium}
                            alt={edge.node.title.native || edge.node.title.romaji}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-2">
                          <span className="text-xs text-primary font-medium">
                            {edge.relationType.replace(/_/g, ' ')}
                          </span>
                          <h4 className="font-medium text-sm line-clamp-2">
                            {edge.node.title.native || edge.node.title.romaji}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {edge.node.format}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {manga.recommendations && manga.recommendations.nodes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-4">推薦作品</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {manga.recommendations.nodes.slice(0, 8).map((node: any) => {
                      const rec = node.mediaRecommendation;
                      return (
                        <Link 
                          key={rec.id} 
                          href={`/${rec.type.toLowerCase()}/${rec.id}`}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                            <Image
                              src={rec.coverImage.extraLarge || rec.coverImage.large || rec.coverImage.medium}
                              alt={rec.title.native || rec.title.romaji}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </div>
                          <div className="p-2">
                            <h4 className="font-medium text-sm line-clamp-2">
                              {rec.title.native || rec.title.romaji}
                            </h4>
                            <p className="text-xs text-gray-500">
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

        <Footer />
      </>
    );
  } catch (error) {
    console.error(`漫畫詳情頁面錯誤 (ID: ${params.id}):`, error);
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-4">載入出錯</h2>
          <p className="mb-6">無法獲取漫畫數據，請稍後再試。</p>
          <Link href="/" className="btn btn-primary">
            返回首頁
          </Link>
        </div>
        <Footer />
      </>
    );
  }
}

export default MangaDetailPage; 