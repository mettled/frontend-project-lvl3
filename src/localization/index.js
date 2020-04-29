
import i18next from 'i18next';
import resources from './locates';

export default () => (
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  })
);
