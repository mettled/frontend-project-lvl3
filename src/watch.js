import { watch } from 'melanke-watchjs';
import { renderControls, renderFeeds, renderNews } from './render';

export default (state) => {
  watch(state, ['isValid', 'error', 'action'], () => {
    renderControls(state);
  });

  watch(state, 'feeds', () => {
    renderFeeds(state);
  });

  watch(state, 'news', () => {
    renderNews(state);
  });
};
