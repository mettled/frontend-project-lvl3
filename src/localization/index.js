import i18next from 'i18next';
import resources from './locales';

export default () => (
  i18next.init({
    lng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    resources,
  })
);
