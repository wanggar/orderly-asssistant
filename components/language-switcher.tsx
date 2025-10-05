'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800"
    >
      <Languages className="w-4 h-4" />
      {language === 'zh' ? t('lang.english') : t('lang.chinese')}
    </Button>
  );
}

