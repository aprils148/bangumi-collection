import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './providers/ThemeProvider'
import ScrollProgressBar from './components/ScrollProgressBar'
import animeData from '../db/anilist-wikidata/wikidata-anime.json'
import DynamicTitle from './components/DynamicTitle'

export const metadata: Metadata = {
  title: '動漫資訊平台 | Bangumi',
  description: '使用AniList API和維基數據的中文動漫資訊平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen modern-dark-blue-gradient text-foreground dark:text-foreground-dark transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <DynamicTitle defaultTitle="動漫資訊平台 | Bangumi" />
          <ScrollProgressBar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
} 