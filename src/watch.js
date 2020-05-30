import { watch } from 'melanke-watchjs';
import { renderForm, renderSources, renderArticles } from './render';


const getElements = () => ({
  inputElement: document.querySelector('#input-source'),
  buttonElement: document.querySelector('#submit-source'),
  messageElement: document.querySelector('#message-source'),
  sourcesElement: document.querySelector('#sources'),
  articlesElement: document.querySelector('#articles'),
  templateElement: document.querySelector('#template-list').content.firstElementChild,
});

export default (state) => {
  const elements = getElements();

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
