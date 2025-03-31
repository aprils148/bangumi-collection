'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface CharacterProps {
  character: {
    id: number;
    node: {
      id: number;
      name: {
        full: string;
        native: string;
      };
      image: {
        large: string;
        medium: string;
        extraLarge?: string;
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
        extraLarge?: string;
      };
      language?: string;
    }[];
  };
}

export const AnimeCharacterCard = ({ character }: CharacterProps) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="flex p-3">
        <div className="w-16 h-16 flex-shrink-0 mr-3">
          <div className="relative w-full h-full rounded-md overflow-hidden">
            <Image
              src={character.node.image.extraLarge || character.node.image.large || character.node.image.medium}
              alt={character.node.name.full}
              fill
              loading="lazy"
              className="object-cover hover:scale-110 transition-transform duration-500"
              sizes="64px"
              quality={90}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-medium text-sm line-clamp-1 dark:text-white">
            {character.node.name.native}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {character.node.name.full}
          </span>
          <span className="text-xs text-primary dark:text-primary-light line-clamp-1 mt-1">
            {character.role}
          </span>
        </div>
      </div>
      
      {character.voiceActors && character.voiceActors.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center">
          <div className="w-8 h-8 flex-shrink-0 mr-2">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={character.voiceActors[0].image.extraLarge || character.voiceActors[0].image.large || character.voiceActors[0].image.medium}
                alt={character.voiceActors[0].name.full}
                fill
                loading="lazy"
                className="object-cover"
                sizes="32px"
                quality={85}
              />
            </div>
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-medium line-clamp-1 dark:text-gray-300">
              {character.voiceActors[0].name.native}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">
              CV
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}; 