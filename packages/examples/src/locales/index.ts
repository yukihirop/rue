import yaml from 'js-yaml';
import fs from 'fs';

export const resources = {
  ja: yaml.load(fs.readFileSync('./src/locales/config/ja.yml', 'utf8'))['rue'],
  en: yaml.load(fs.readFileSync('./src/locales/config/en.yml', 'utf8'))['rue'],
};
