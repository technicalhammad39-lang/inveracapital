'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, defaultLanguage, fetchDictionary } from '@/lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [dictionary, setDictionary] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language safely on mount
  useEffect(() => {
    const saved = localStorage.getItem('invera-language') as Language;
    if (saved) {
      setLanguageState(saved);
      applyRtl(saved);
    } else {
      applyRtl(defaultLanguage);
    }
  }, []);

  // Fetch dictionary whenever language changes
  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    fetchDictionary(language).then((dict) => {
      if (isMounted) {
        setDictionary(dict);
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [language]);

  const applyRtl = (lang: Language) => {
    document.documentElement.lang = lang;
    if (lang === 'ar' || lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('invera-language', lang);
    applyRtl(lang);
  };

  const t = useCallback((key: string, fallback?: string): string => {
    if (!isLoaded) return fallback || key; // Return raw key or fallback while loading
    return dictionary[key] || fallback || key;
  }, [dictionary, isLoaded]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isLoaded }}>
      <div dir={language === 'ar' || language === 'ur' ? 'rtl' : 'ltr'} className="flex w-full flex-1 transition-all duration-300">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
