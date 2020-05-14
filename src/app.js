/*  eslint no-param-reassign: 0 */

import uniqueId from 'lodash/uniqueId';
import watch from './watch';
import localize from './localization';
import fetchArticles from './fetchArticles';
import validate from './validate';
import initializeState from './initializeState';
import { STATUS, ERRORS } from './constants';

const PERIOD_REQUEST = 5000;
let timerID;

const findLink = (checkLink, storage) => (
  Array.from(storage).find(({ link }) => link === checkLink)
);

const initControllers = (state) => {
  const addContentToState = (contents) => {
    contents.forEach(({
      source: {
        title: sourceTitle, description: sourceDescription, link: sourceLink,
      }, articles,
    }) => {
      const foundSource = findLink(sourceLink, state.sources);
      const uniqID = foundSource ? foundSource.id : uniqueId();

      if (!foundSource) {
        state.status = STATUS.ADDED;
        state.error = ERRORS.EMPTY;
        state.sources.push({
          id: uniqID,
          title: sourceTitle,
          description: sourceDescription,
          link: sourceLink,
        });
      }
      const newArticles = articles.filter(({ link }) => !findLink(link, state.articles));
      if (newArticles.length === 0) {
        return;
      }
      const articlesWithID = newArticles.map(({ title, description, link }) => ({
        sourceId: uniqID, title, description, link,
      }));
      state.articles.push(...articlesWithID);
    });
  };

  const getContent = (links, periodRequest = false) => {
    const requestLinks = !periodRequest ? [links] : state.sources.map(({ link }) => link);
    fetchArticles(requestLinks)
      .then((contents) => {
        addContentToState(contents);
      })
      .catch(({ message }) => {
        state.status = STATUS.ERROR;
        state.error = message === ERRORS.NOFEED ? ERRORS.NOFEED : ERRORS.NETWORK;
      })
      .finally(() => {
        timerID = setTimeout(getContent, PERIOD_REQUEST, [], true);
      });
  };

  const onContentInput = ({ target: { value } }) => {
    state.error = ERRORS.EMPTY;
    if (value.length === 0) {
      state.status = STATUS.EMPTY;
      return;
    }
    const { status } = validate(value, state.sources);
    state.status = status;
  };

  const onContentSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('url');

    state.status = STATUS.WAIT;
    state.error = ERRORS.EMPTY;

    clearTimeout(timerID);
    getContent(link, false);
  };

  document.querySelector('#rssChannel input')
    .addEventListener('input', onContentInput);

  document.querySelector('#rssChannel')
    .addEventListener('submit', onContentSubmit);
};

const app = () => {
  localize()
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
