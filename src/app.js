/*  eslint no-param-reassign: 0 */

import { uniqueId, differenceWith } from 'lodash';
import watch from './watch';
import initLocalization from './localization';
import validate from './validate';
import initializeState from './initializeState';
import parse from './parse';
import makeRequest from './makeRequest';
import { statuses, errors } from './constants';

const addIDToArticles = (id, articles) => (
  articles.map(({ title, description, link }) => ({
    sourceId: id, title, description, link,
  }))
);

const fetchSource = ({ sources, articles: articlesState, form }, link) => (
  makeRequest(link)
    .then(({ data: { contents, status: { url } } }) => {
      let parsedContent;
      try {
        parsedContent = parse(contents);
      } catch (e) {
        form.status = statuses.ERROR;
        form.error = errors.NO_FEED;
        return;
      }
      const { source, articles } = parsedContent;
      const sourceID = uniqueId();
      const sourceWithID = {
        sourceID,
        ...source,
        link: url,
        status: statuses.CONNECT,
      };
      const articlesWithID = addIDToArticles(sourceID, articles);
      sources.push(sourceWithID);
      articlesState.push(...articlesWithID);
      form.status = statuses.ADDED;
      form.error = null;
    })
    .catch(() => {
      form.status = statuses.ERROR;
      form.error = errors.NETWORK;
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
        sources[index].status = statuses.CONNECT;
        if (status === 'rejected') {
          sources[index].status = statuses.NO_CONNECT;
          return;
        }
        let articles;
        try {
          articles = parse(contents).articles;
        } catch (e) {
          sources[index].status = errors.NO_FEED;
          return;
        }

        const newArticles = differenceWith(articles,
          stateArticles,
          ({ link: link1 }, { link: link2 }) => link1 === link2);

        if (newArticles.length === 0) {
          return;
        }
        const articlesWithID = addIDToArticles(sourcesID[index], newArticles);
        stateArticles.push(...articlesWithID);
      })
    ))
    .catch(() => {
      form.status = statuses.ERROR;
      form.error = errors.NETWORK;
    })
    .finally(() => {
      setTimeout(updateSources, PERIOD_REQUEST, state);
    });
};

const handlers = (state) => {
  const onInput = ({ target: { value } }) => {
    state.form.error = null;
    if (value.length === 0) {
      state.form.status = statuses.EMPTY;
      return;
    }
    const error = validate(value, state.sources);
    state.form.status = error ? statuses.ERROR : statuses.VALID;
    state.form.error = error;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('url');

    state.form.status = statuses.WAIT;
    state.form.error = null;
    fetchSource(state, link);
  };

  document.querySelector('#rssChannel input')
    .addEventListener('input', onInput);

  document.querySelector('#rssChannel')
    .addEventListener('submit', onSubmit);
};

const app = () => {
  initLocalization()
    .then(() => {
      const state = initializeState();
      const elements = ({
        inputElement: document.querySelector('#input-source'),
        buttonElement: document.querySelector('#submit-source'),
        messageElement: document.querySelector('#message-source'),
        sourcesElement: document.querySelector('#sources'),
        articlesElement: document.querySelector('#articles'),
        templateElement: document.querySelector('#template-list').content.firstElementChild,
      });
      handlers(state);
      watch(state, elements);
      updateSources(state);
    })
    .catch(() => {
      console.log('Something went wrong during initialization');
    });
};

export default app;
