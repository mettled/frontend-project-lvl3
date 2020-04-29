import uniqueId from 'lodash/uniqueId';
import watch from './watch';
import localization from './localization';
import getContent from './getContent';
import validate from './validate';
import initialState from './initialState';

const PERIOD_REQUEST = 5000;
let timerID;

const findLink = (checkLink, storage) => (
  Array.from(storage).find(({ link }) => link === checkLink)
);

export default () => {
  const state = initialState();
  localization();
  watch(state);

  const addContentToState = (data) => {
    data.forEach((content) => {
      const {
        source: {
          title: sourceTitle, description: sourceDescription, link: sourceLink,
        }, articles,
      } = content;

      const findedSource = findLink(sourceLink, state.sources);
      const uniqID = findedSource ? findedSource.id : uniqueId();

      if (!findedSource) {
        state.status = 'added';
        state.sources.push({
          id: uniqID,
          title: sourceTitle,
          description: sourceDescription,
          link: sourceLink,
        });
      }

      const newArticles = articles.filter(({ link }) => (!findLink(link, state.articles)));
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
    getContent(requestLinks)
      .then((data) => {
        addContentToState(data);
        state.error = '';
      })
      .catch(() => {
        state.error = 'networkError';
      })
      .finally(() => {
        timerID = setTimeout(addContent, PERIOD_REQUEST, [], true);
      });
  };

  const onContentInput = (event) => {
    const link = event.target.value;
    if (link.length === 0) {
      state.status = 'empty';
      return;
    }
    const { resultValidation } = validate(link, state.sources);
    state.status = resultValidation;
  };

  const onContentSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const link = form.get('url');

    clearTimeout(timerID);
    addContent(link, false);
  };

  document.querySelector('#rssChanel input')
    .addEventListener('input', onContentInput);

  document.querySelector('#rssChanel')
    .addEventListener('submit', onContentSubmit);
};
