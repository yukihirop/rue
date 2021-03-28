import i18n from 'i18next';
import { ja, en } from './config';

/**
 * @see https://i18next.github.io/i18next/pages/doc_features.html
 */
i18n.init({
  fallbackLng: 'en',
  resources: {
    ja: {
      translation: ja,
    },
    en: {
      translation: en,
    },
  },
});

export default i18n;
