export type Languages = 'ja' | 'en';

/**
 * @see https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
 */
export type I18nOptions = {
  lng: Languages;
  fallbackLng?: Languages;
};

export type I18nResources = {
  [P in Languages]?: Record<string, any>;
};

export type I18nConfig = {
  options: I18nOptions;
  resources?: I18nResources;
};

export type RueRuntimeConfig = {
  i18n: I18nConfig;
};
