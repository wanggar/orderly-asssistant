'use client';

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

interface WelcomeScreenProps {
  onStartChat: () => void;
  onSelectPeopleCount: (count: number) => void;
}

export function WelcomeScreen({ onSelectPeopleCount }: WelcomeScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-3xl font-bold text-[#333333] mb-2">{t('welcome.title')}</h1>
        <p className="text-gray-600 text-lg">{t('welcome.subtitle')}</p>
      </div>
      
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl">
        {features.map((feature, index) => (
          <Card key={index} className="border-none shadow-sm bg-white/50">
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                {feature.icon}
              </div>
              <h3 className="font-medium text-[#333333] mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div> */}
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#333333] mb-6">{t('welcome.peopleCount')}</h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[1, 2, 3, 4].map((count) => (
            <Button
              key={count}
              onClick={() => onSelectPeopleCount(count)}
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-[#FF6B2D] text-[#FF6B2D] hover:bg-[#FF6B2D] hover:text-white font-medium text-lg transition-all duration-200"
            >
              {count}
              {t('welcome.people')}
            </Button>
          ))}
          <Button
            onClick={() => onSelectPeopleCount(5)}
            variant="outline"
            className="px-4 h-16 rounded-full border-2 border-[#FF6B2D] text-[#FF6B2D] hover:bg-[#FF6B2D] hover:text-white font-medium text-lg transition-all duration-200"
          >
            5{t('welcome.peoplePlus')}
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        {t('welcome.hint')}
      </p>
    </div>
  );
}