/**
 * 錯誤日誌工具 - 處理API錯誤並提供統一的日誌格式
 */

// 記錄API錯誤
export function logApiError(
  source: string,
  errorType: string,
  id: string | number,
  error: unknown,
  additionalInfo?: Record<string, any>
) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const logData = {
    timestamp: new Date().toISOString(),
    source,
    errorType,
    id,
    error: errorMessage,
    ...(additionalInfo || {})
  };
  
  // 在開發環境中顯示詳細錯誤
  if (process.env.NODE_ENV === 'development') {
    console.error('API錯誤:', logData);
    if (error instanceof Error && error.stack) {
      console.error('錯誤堆疊:', error.stack);
    }
  } else {
    // 生產環境使用簡潔的日誌格式
    console.error(`API錯誤: [${source}] ${errorType} (ID: ${id}): ${errorMessage}`);
  }
  
  // 這裡可以添加發送錯誤到外部服務的邏輯，如Sentry等
  // TODO: 實現錯誤報告整合
}

// 記錄TMDB特定錯誤
export function logTMDBError(
  anilistId: string | number,
  tmdbId: string | number | null,
  errorType: string,
  error: unknown
) {
  logApiError(
    'TMDB', 
    errorType, 
    anilistId, 
    error, 
    { tmdbId: tmdbId }
  );
}

// 格式化錯誤提示，用於前端顯示
export function formatUserFriendlyError(
  errorType: 'fetch' | 'notFound' | 'invalid' | 'unknown',
  resourceType: string = '資源'
): string {
  switch (errorType) {
    case 'fetch':
      return `獲取${resourceType}時出現錯誤，請稍後再試`;
    case 'notFound':
      return `找不到請求的${resourceType}`;
    case 'invalid':
      return `提供的${resourceType}ID無效`;
    case 'unknown':
    default:
      return `處理請求時發生未知錯誤`;
  }
} 