import { watch } from 'melanke-watchjs';
import { renderControls, renderSources, renderArticles } from './render';

export default (state) => {
  watch(state, ['error', 'action'], () => {
    renderControls(state);
  });

  watch(state, 'sources', () => {
    renderSources(state);
  });

  watch(state, 'articles', () => {
    renderArticles(state);
  });
};
