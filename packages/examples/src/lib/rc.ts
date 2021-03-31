// rue packages
import { Rue } from '@rue/rue';

// locals
import { resources } from '@/locales';

Rue.configure({
  i18n: {
    options: {
      lng: 'ja',
    },
    resources,
  },
});
