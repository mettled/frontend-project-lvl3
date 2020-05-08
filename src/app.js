/*  eslint no-param-reassign: 0 */

import uniqueId from 'lodash/uniqueId';
import watch from './watch';
import localize from './localization';
import fetchLinks from './fetchArticles';
import validate from './validate';
import initializeState from './initializeState';
import { STATUS, ERROR } from './constants';

const PERIOD_REQUEST = 5000;
let timerID;

const findLink = (checkLink, storage) => (
  Array.from(storage).find(({ link }) => link === checkLink)
);

const initControllers = (state) => {
  const addContentToState = (contents) => {
    contents.forEach((content) => {
      const {
        source: {
          title: sourceTitle, description: sourceDescription, link: sourceLink,
        }, articles,
      } = content;

      const foundSource = findLink(sourceLink, state.sources);
      const uniqID = foundSource ? foundSource.id : uniqueId();

      if (!foundSource) {
        state.status = STATUS.ADDED;
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

  const addContent = (links, periodRequest = false) => {
    const requestLinks = !periodRequest ? [links] : state.sources.map(({ link }) => link);
    fetchArticles(requestLinks)
      .then((contents) => {
        addContentToState(contents);
        state.error = ERROR.EMPTY;
      })
      .catch(() => {
        state.error = ERROR.NETWORK;
      })
      .finally(() => {
        timerID = setTimeout(addContent, PERIOD_REQUEST, [], true);
      });
  };

  const onContentInput = (e) => {
    const link = e.target.value;
    if (link.length === 0) {
      state.status = STATUS.EMPTY;
      return;
    }
    const { resultValidation } = validate(link, state.sources);
    state.status = resultValidation;
  };

  const onContentSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('url');

    clearTimeout(timerID);
    addContent(link, false);
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
