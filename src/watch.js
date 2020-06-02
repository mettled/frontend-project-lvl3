import { watch } from 'melanke-watchjs';
import { renderForm, renderSources, renderArticles } from './render';

export default (state, elements) => {
  watch(state.form, ['error', 'status'], () => {
    renderForm(state, elements);
  });

  watch(state, 'sources', () => {
    renderSources(state, elements);
  });

  watch(state, 'articles', () => {
    renderArticles(state, elements);
  });
};
