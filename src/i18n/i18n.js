// src/i18n/i18n.js
// react-i18next setup — drop-in replacement for the custom LanguageContext
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import th from './locales/th.json';

i18n
  .use(LanguageDetector)       // auto-detect from localStorage / browser
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
    },
    // Detection order: localStorage key → browser header → fallback
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'biochar_lang',  // same key as the old system
      caches: ['localStorage'],
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,  // React already escapes
    },
  });

// Keep document.lang in sync
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng === 'th' ? 'th-TH' : 'en';
});

export default i18n;
