import 'bootstrap/dist/css/bootstrap.min.css';
import uniqueId from 'lodash/uniqueId';
import i18next from 'i18next';
import watch from './watch';
import resources from './locales';
import getContent from './getContent';
import validate from './validate';

const PERIOD_REQUEST = 5000;
let timerID;

i18next.init({
  lng: 'en',
  debug: true,
  resources,
});

const state = {
  activeLink: '',
  action: '',
  error: '',
  disable: true,
  sources: [],
  articles: [],
};

const findLink = (checkLink, storage) => (
  Array.from(storage).find(({ link }) => link === checkLink)
);

const addStateContent = (data) => {
  data.forEach((content) => {
    const {
      source: {
        title: sourceTitle, description: sourceDescription, link: sourceLink,
      }, articles,
    } = content;

    const findedSource = findLink(sourceLink, state.sources);
    const uniqID = findedSource ? findedSource.id : uniqueId();

    if (!findedSource) {
      state.action = 'added';
      state.disable = true;
      state.activeLink = '';
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
      addStateContent(data);
    })
    .catch(() => {
      state.disable = true;
      state.action = '';
      state.error = 'networkError';
    })
    .finally(() => {
      timerID = setTimeout(addContent, PERIOD_REQUEST, [], true);
    });
};

const onContentInput = (event) => {
  state.activeLink = event.target.value;
  if (state.activeLink.length === 0) {
    state.disable = true;
    state.action = 'wait';
    state.error = '';
    return;
  }

  if (validate(state.activeLink, state.sources)) {
    state.disable = false;
    state.action = 'validation';
    state.error = '';
    return;
  }
  state.disable = true;
  state.action = '';
  state.error = 'linkError';
};

const onContentSubmit = (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const link = form.get('url');

  clearTimeout(timerID);
  addContent(link, false);
};

watch(state);

document.querySelector('#rssChanel input')
  .addEventListener('input', onContentInput);

document.querySelector('#rssChanel')
  .addEventListener('submit', onContentSubmit);
