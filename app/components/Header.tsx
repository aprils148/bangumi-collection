'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';
import { IoSearchOutline, IoHomeOutline, IoTvOutline, IoCalendarOutline, IoBookOutline, IoMenu, IoClose } from 'react-icons/io5';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { name: '首頁', href: '/', icon: <IoHomeOutline className="w-5 h-5" /> },
    { name: '動畫', href: '/anime', icon: <IoTvOutline className="w-5 h-5" /> },
    { name: '放送表', href: '/airing', icon: <IoCalendarOutline className="w-5 h-5" /> },
    { name: '漫畫', href: '/manga', icon: <IoBookOutline className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // 專門檢查動畫路徑，包括trending和airing子路徑
  const isAnimeActive = () => {
    return pathname.startsWith('/anime') || pathname.startsWith('/trending') || pathname.startsWith('/airing');
  };

  // 處理搜尋提交
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=ANIME`);
      setIsSearchActive(false);
      setSearchQuery('');
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  // 當搜尋欄激活時，自動聚焦到輸入框
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  // 點擊外部關閉搜尋欄
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchActive &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchActive]);

  // 按ESC鍵關閉搜尋欄
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchActive) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchActive]);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="z-50 sticky top-0"
    >
      <div className="glass border-b border-white/10 shadow-lg backdrop-blur-xl py-3 md:py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 z-20">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="relative z-10"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 4.5H9C6.17157 4.5 3.5 7.17157 3.5 10C3.5 12.8284 6.17157 15.5 9 15.5H15C17.8284 15.5 20.5 12.8284 20.5 10C20.5 7.17157 17.8284 4.5 15 4.5Z" className="fill-white/90" />
                <path d="M9 16.5H15C19.1421 16.5 22.5 13.1421 22.5 9C22.5 4.85786 19.1421 1.5 15 1.5H9C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5ZM15 19.5C12.5556 19.5 10.5 21.5556 10.5 24H13.5C13.5 23.1716 14.1716 22.5 15 22.5C15.8284 22.5 16.5 23.1716 16.5 24H19.5C19.5 21.5556 17.4444 19.5 15 19.5ZM7.5 24C7.5 21.5556 5.44444 19.5 3 19.5C0.555556 19.5 0 21.5556 0 24H3C3 23.1716 3 22.5 3 22.5C3.82843 22.5 4.5 23.1716 4.5 24H7.5Z" className="fill-gray-300" />
              </svg>
            </motion.div>
            <span className="text-2xl font-bold text-gradient hidden sm:inline">動漫資訊</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="relative group">
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                      {item.icon}
                      <span className={`font-medium transition-colors ${
                        item.href === '/anime' ? isAnimeActive() : isActive(item.href) 
                          ? 'text-white' 
                          : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    {(item.href === '/anime' ? isAnimeActive() : isActive(item.href)) && (
                      <motion.span
                        layoutId="underline"
                        className="absolute left-0 right-0 bottom-[-8px] h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-2">
            {/* 搜尋按鈕 */}
            <AnimatePresence>
              {isSearchActive ? (
                <motion.form
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="relative"
                  onSubmit={handleSearch}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋動畫..."
                    className="w-full h-10 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="submit"
                    className="absolute left-0 top-0 h-full flex items-center justify-center w-10 text-gray-300 hover:text-white"
                  >
                    <IoSearchOutline className="w-5 h-5" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsSearchActive(true)}
                  aria-label="搜尋"
                >
                  <IoSearchOutline className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button 
              className="block md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="導航選單"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IoClose className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IoMenu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute w-full z-40 glass border-b border-white/10 shadow-xl"
          >
            <div className="p-4">
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋動畫..."
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="absolute left-0 top-0 h-full flex items-center justify-center w-12 text-gray-300"
                >
                  <IoSearchOutline className="w-5 h-5" />
                </button>
              </form>
              
              <ul className="space-y-2 pb-2">
                {navItems.map((item) => (
                  <motion.li 
                    key={item.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Link 
                      href={item.href} 
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        item.href === '/anime' ? isAnimeActive() : isActive(item.href) 
                          ? 'bg-white/10 text-white' 
                          : 'hover:bg-white/5 text-gray-300 hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header; 