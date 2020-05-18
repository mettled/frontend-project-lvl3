/*  eslint no-param-reassign: 0 */

import { uniqueId, head } from 'lodash';
import watch from './watch';
import initLocalization from './localization';
import fetchArticles from './fetchArticles';
import validate from './validate';
import initializeState from './initializeState';
import { STATUS, ERRORS } from './constants';
import {
  checkLink, getNewArticles, addIDToArticles, addIDToSource,
} from './helpers';

const initControllers = (state) => {
  const PERIOD_REQUEST = 5000;
  let timerID;

  const addContentToState = (contents) => {
    contents.forEach(({
      source,
      articles,
    }) => {
      const foundSource = checkLink(source.link, state.sources);
      const sourceId = foundSource ? foundSource.id : uniqueId();

      if (!foundSource) {
        state.statusForm = STATUS.ADDED;
        state.errorForm = ERRORS.EMPTY;
        const sourceItem = addIDToSource(sourceId, source);
        state.sources.push(sourceItem);
      }
      const newArticles = getNewArticles(articles, state.articles);
      if (newArticles.length === 0) {
        return;
      }
      const articlesWithID = addIDToArticles(sourceId, newArticles);
      state.articles.push(...articlesWithID);
    });
  };

  const getContent = (links, periodRequest = false) => {
    const requestLinks = !periodRequest ? links : state.sources.map(({ link }) => link);
    fetchArticles(requestLinks)
      .then((contents) => {
        if (state.statusForm === STATUS.WAIT && !head(contents).isRSS) {
          state.statusForm = STATUS.ERROR;
          state.errorForm = ERRORS.NOFEED;
          return;
        }
        addContentToState(contents);
      })
      .catch(() => {
        state.statusForm = STATUS.ERROR;
        state.errorForm = ERRORS.NETWORK;
      })
      .finally(() => {
        if (state.sources.length > 0) {
          timerID = setTimeout(getContent, PERIOD_REQUEST, [], true);
        }
      });
  };

  const onInput = ({ target: { value } }) => {
    state.errorForm = ERRORS.EMPTY;
    if (value.length === 0) {
      state.statusForm = STATUS.EMPTY;
      return;
    }
    const { status, error } = validate(value, state.sources);
    state.statusForm = status;
    state.errorForm = error;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('url');

    state.statusForm = STATUS.WAIT;
    state.errorForm = ERRORS.EMPTY;
    clearTimeout(timerID);
    getContent([link], false);
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
    });
};

export default app;
