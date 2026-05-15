// @ts-nocheck
import { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('biochar_lang') || 'en'
  );

  function setLanguage(next) {
    setLang(next);
    localStorage.setItem('biochar_lang', next);
    document.documentElement.lang = next === 'th' ? 'th-TH' : 'en';
  }

  function toggleLang() {
    const next = lang === 'en' ? 'th' : 'en';
    setLanguage(next);
  }

  // t(key) — looks up key in translations[lang], falls back to 'en', then the key itself
  function t(key) {
    return (
      translations[lang]?.[key] ??
      translations['en']?.[key] ??
      key
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
