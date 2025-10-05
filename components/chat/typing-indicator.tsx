'use client';

import { useLanguage } from '@/lib/language-context';

export function TypingIndicator() {
  const { t } = useLanguage();
  
  return (
    <div className="flex w-full mb-4 justify-start">
      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#FFF5EB] text-[#333333]">
        <div className="flex items-center space-x-2">
          <div className="text-lg">🐻</div>
          <div className="text-sm text-gray-500">{t('chat.thinking')}</div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}