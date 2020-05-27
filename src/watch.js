import { watch } from 'melanke-watchjs';
import { renderForm, renderSources, renderArticles } from './render';

export default (state) => {
  watch(state.form, ['error', 'status'], () => {
    renderForm(state);
  });

  watch(state, 'sources', () => {
    renderSources(state);
  });

  watch(state, 'articles', () => {
    renderArticles(state);
  });
};
