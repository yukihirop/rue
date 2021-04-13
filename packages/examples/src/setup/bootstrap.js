const { Rue } = require('@ruejs/rue');

/**
 * Please Override 'i18n.resources'. 'i18n.resources' is a translation file of activerecord/activemodel/activeform.
 */
Rue.configure({
  i18n: {
    options: {
      lng: 'en',
    },
  },
});
