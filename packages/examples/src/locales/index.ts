import i18n from 'i18next';
import yaml from 'js-yaml';
import fs from 'fs';

const resources = {
  ja: { translation: yaml.load(fs.readFileSync('./src/locales/config/ja.yml', 'utf8')) },
  en: { translation: yaml.load(fs.readFileSync('./src/locales/config/en.yml', 'utf8')) },
};

i18n.init({
  lng: 'ja',
  fallbackLng: 'en',
  resources,
});

export default i18n;
