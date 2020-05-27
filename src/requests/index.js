/*  eslint no-param-reassign: 0 */

import { uniqueId } from 'lodash';
import parse from '../parse';
import makeRequest from './makeRequest';
import { STATUS, ERRORS } from '../constants';
import { addIDToArticles, addIDToSource, getNewArticles } from '../helpers';

const PERIOD_REQUEST = 5000;

const addSource = (state, link) => (
  makeRequest(link)
    .then(({ data: { contents, status: { url } } }) => {
      const parsedContent = parse(contents);

      if (!parsedContent) {
        state.form.status = STATUS.ERROR;
        state.form.error = ERRORS.NOFEED;
        return;
      }
      const { source, articles } = parsedContent;
      const sourceID = uniqueId();
      const sourcesWithID = addIDToSource(sourceID, { ...source, link: url });
      const articlesWithID = addIDToArticles(sourceID, articles);
      state.sources.push(sourcesWithID);
      state.articles.push(...articlesWithID);
      state.form.status = STATUS.ADDED;
      state.form.error = ERRORS.EMPTY;
    })
    .catch(() => {
      state.form.status = STATUS.ERROR;
      state.form.error = ERRORS.NETWORK;
    })
);

const updateSources = (state) => {
  const { sources } = state;
  const requests = sources.map(({ link }) => makeRequest(link));
  const sourcesID = sources.map(({ id }) => id);
  return Promise.allSettled(requests)
    .then((responses) => (
      responses
        .forEach((response, index) => {
          if (response.status === 'rejected') {
            sources[index].status = false;
            return;
          }
          const { articles } = parse(response.contents);
          const newArticles = getNewArticles(articles, state.articles);
          if (newArticles.length === 0) {
            return;
          }
          const articlesWithID = addIDToArticles(sourcesID[index], newArticles);
          state.articles.push(...articlesWithID);
        })
    ))
    .catch(() => {
      state.form.status = STATUS.ERROR;
      state.form.error = ERRORS.NETWORK;
    })
    .finally(() => {
      setTimeout(updateSources, PERIOD_REQUEST, state);
    });
};

export { addSource, updateSources };
