import i18n from 'i18next';
import { ja, en } from './config';

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
