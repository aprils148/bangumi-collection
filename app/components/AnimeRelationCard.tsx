'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface RelationProps {
  relation: {
    node: {
      id: number;
      title: {
        romaji: string;
        native: string;
      };
      coverImage: {
        medium: string;
        large: string;
        extraLarge?: string;
      };
      format: string;
      type: string;
    };
    relationType: string;
  };
}

// 關係類型的中文映射
const relationTypeMap: Record<string, string> = {
  SEQUEL: '續作',
  PREQUEL: '前作',
  SIDE_STORY: '外傳',
  PARENT: '母作品',
  CHILD: '子作品',
  ADAPTATION: '改編',
  SUMMARY: '總集篇',
  ALTERNATIVE: '替代版本',
  CHARACTER: '相同角色',
  OTHER: '其他'
};

export const AnimeRelationCard = ({ relation }: RelationProps) => {
  const relationType = relationTypeMap[relation.relationType] || relation.relationType;
  const href = relation.node.type.toLowerCase() === 'anime' 
    ? `/anime/${relation.node.id}` 
    : `/manga/${relation.node.id}`;

  return (
    <motion.div whileHover={{ y: -5 }}>
      <Link
        href={href}
        className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
      >
        <div className="relative h-40 overflow-hidden">
          <Image
            src={relation.node.coverImage.extraLarge || relation.node.coverImage.large || relation.node.coverImage.medium}
            alt={relation.node.title.native || relation.node.title.romaji}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 50vw, 200px"
            quality={85}
          />
          <div className="absolute top-0 right-0 bg-primary/80 text-white text-xs px-2 py-1 rounded-bl">
            {relationType}
          </div>
        </div>
        <div className="p-3">
          <p className="font-medium line-clamp-2 text-sm dark:text-white">
            {relation.node.title.native || relation.node.title.romaji}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
            {relation.node.format?.replace(/_/g, ' ')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}; 