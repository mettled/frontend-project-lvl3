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
  wait() {
    this.disable = true;
    this.action = 'wait';
    this.error = '';
  },
  addSource() {
    this.action = 'added';
    this.disable = true;
    this.activeLink = '';
  },
  setValidation() {
    this.disable = false;
    this.action = 'validation';
    this.error = '';
  },
  setError(error) {
    this.disable = true;
    this.action = '';
    this.error = error;
  },
};

const findLink = (checkLink, storage) => (
  Array.from(storage).find(({ link }) => link === checkLink)
);

const undateStateContent = (data) => {
  data.forEach((content) => {
    const {
      source: {
        title: sourceTitle, description: sourceDescription, link: sourceLink,
      }, articles,
    } = content;

    const findedSource = findLink(sourceLink, state.sources);
    const uniqID = findedSource ? findedSource.id : uniqueId();

    if (!findedSource) {
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
      state.addSource();
      undateStateContent(data);
    })
    .catch(() => {
      state.setError('networkError');
    })
    .finally(() => {
      timerID = setTimeout(addContent, PERIOD_REQUEST, [], true);
    });
};

const onContentInput = (event) => {
  state.activeLink = event.target.value;
  if (state.activeLink.length === 0) {
    state.wait();
    return;
  }

  if (validate(state.activeLink, state.sources)) {
    state.setValidation();
    return;
  }
  state.setError('linkError');
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
