'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface AnimeBannerProps {
  bannerImage: string;
  title: string;
}

export const AnimeBanner = ({ bannerImage, title }: AnimeBannerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-64 md:h-80 w-full mb-8 overflow-hidden rounded-lg"
    >
      <Image
        src={bannerImage}
        alt={title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJeALYlv2TAwAAAABJRU5ErkJggg=="
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-0 left-0 p-6 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">
          {title}
        </h1>
      </motion.div>
    </motion.div>
  );
}; 