import { watch } from 'melanke-watchjs';
import { renderInputState, renderFeeds, renderNews } from './render';

export default (state) => {
  watch(state, ['isValid', 'error', 'action'], () => {
    renderInputState(state);
  });

  watch(state, 'feeds', () => {
    renderFeeds(state);
  });

  watch(state, 'news', () => {
    renderNews(state);
  });
};
