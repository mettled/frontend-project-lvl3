import { watch } from 'melanke-watchjs';
import { renderForm, renderSources, renderArticles } from './render';

export default (state) => {
  watch(state, ['errorForm', 'statusForm'], () => {
    renderForm(state);
  });

  watch(state, 'sources', () => {
    renderSources(state);
  });

  watch(state, 'articles', () => {
    renderArticles(state);
  });
};
