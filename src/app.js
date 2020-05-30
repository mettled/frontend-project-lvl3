/*  eslint no-param-reassign: 0 */

import { uniqueId } from 'lodash';
import watch from './watch';
import initLocalization from './localization';
import validate from './validate';
import initializeState from './initializeState';
import parse from './parse';
import makeRequest from './requests/makeRequest';
import { STATUS, ERRORS } from './constants';

const getNewArticles = (articles, storage) => (
  articles.filter(({ link }) => !storage.find(({ link: storageLink }) => link === storageLink))
);

const addIDToArticles = (id, articles) => (
  articles.map(({ title, description, link }) => ({
    sourceId: id, title, description, link,
  }))
);

const addIDToSource = (id, source) => ({
  id, ...source, status: true,
});

const addSource = ({ sources: sourcesState, articles: articlesState, form }, link) => (
  makeRequest(link)
    .then(({ data: { contents, status: { url } } }) => {
      const parsedContent = parse(contents);

      if (parsedContent.error) {
        form.status = STATUS.ERROR;
        form.error = ERRORS.NOFEED;
        return;
      }
      const { source, articles } = parsedContent;
      const sourceID = uniqueId();
      const sourcesWithID = addIDToSource(sourceID, { ...source, link: url });
      const articlesWithID = addIDToArticles(sourceID, articles);
      sourcesState.push(sourcesWithID);
      articlesState.push(...articlesWithID);
      form.status = STATUS.ADDED;
      form.error = null;
    })
    .catch(() => {
      form.status = STATUS.ERROR;
      form.error = ERRORS.NETWORK;
    })
);

const updateSources = (state) => {
  const PERIOD_REQUEST = 5000;
  const { sources, articles: stateArticles, form } = state;
  const requests = sources.map(({ link }) => makeRequest(link));
  const sourcesID = sources.map(({ id }) => id);
  return Promise.allSettled(requests)
    .then((responses) => (
      responses.forEach(({ value: { data: { contents } }, status }, index) => {
        sources[index].status = status === 'fulfilled';
        const { articles } = parse(contents);
        const newArticles = getNewArticles(articles, stateArticles);

        if (newArticles.length === 0) {
          return;
        }
        const articlesWithID = addIDToArticles(sourcesID[index], newArticles);
        stateArticles.push(...articlesWithID);
      })
    ))
    .catch(() => {
      form.status = STATUS.ERROR;
      form.error = ERRORS.NETWORK;
    })
    .finally(() => {
      setTimeout(updateSources, PERIOD_REQUEST, state);
    });
};

const initControllers = (state) => {
  const onInput = ({ target: { value } }) => {
    state.form.error = null;
    if (value.length === 0) {
      state.form.status = STATUS.EMPTY;
      return;
    }
    const { error } = validate(value, state.sources);
    state.form.status = error ? STATUS.ERROR : STATUS.VALID;
    state.form.error = error;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('url');

    state.form.status = STATUS.WAIT;
    state.form.error = null;
    addSource(state, link);
  };

  document.querySelector('#rssChannel input')
    .addEventListener('input', onInput);

  document.querySelector('#rssChannel')
    .addEventListener('submit', onSubmit);
};

const app = () => {
  initLocalization()
    .catch(() => {
      console.log('Something went wrong during initialization');
    })
    .finally(() => {
      const state = initializeState();
      initControllers(state);
      watch(state);
      updateSources(state);
    });
};

export default app;
