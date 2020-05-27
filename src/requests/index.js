/*  eslint no-param-reassign: 0 */

import { uniqueId } from 'lodash';
import parse from '../parse';
import makeRequest from './makeRequest';
import { STATUS, ERRORS } from '../constants';
import { addIDToArticles, addIDToSource, getNewArticles } from '../helpers';

const PERIOD_REQUEST = 5000;

const addSource = ({ sources: sourcesState, articles: articlesState, form }, link) => (
  makeRequest(link)
    .then(({ data: { contents, status: { url } } }) => {
      const parsedContent = parse(contents);

      if (!parsedContent) {
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
      form.error = ERRORS.EMPTY;
    })
    .catch(() => {
      form.status = STATUS.ERROR;
      form.error = ERRORS.NETWORK;
    })
);

const updateSources = (state) => {
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

export { addSource, updateSources };
