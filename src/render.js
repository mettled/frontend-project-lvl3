import i18next from 'i18next';
import resources from './locales';

i18next.init({
  lng: 'en',
  debug: true,
  resources,
});

const elements = {
  getElementRssChanel: document.querySelector('[id="rssChanel"] input'),
  getElementFeeds: document.querySelector('[id="feeds"]'),
  getElementNews: document.querySelector('[id="news"]'),
  getElementMessage: document.querySelector('[id="rssMessage"]'),
};

export const renderInputState = (state) => {
  const {
    action, error,
  } = state;
  if (error) {
    elements.getElementRssChanel.classList.remove('is-valid');
    elements.getElementRssChanel.classList.add('is-invalid');

    elements.getElementMessage.classList.remove('valid-feedback');
    elements.getElementMessage.classList.add('invalid-feedback');

    elements.getElementMessage.innerHTML = `${i18next.t(`state.${action}`)}: ${error}`;
    return;
  }

  elements.getElementRssChanel.classList.remove('is-invalid');
  elements.getElementRssChanel.classList.add('is-valid');

  elements.getElementMessage.classList.remove('invalid-feedback');
  elements.getElementMessage.classList.add('valid-feedback');

  elements.getElementMessage.innerHTML = `${i18next.t(`state.${action}`)}`;

  if (action !== i18next.t(`state.${action}`)) {
    return;
  }
};

export const renderFeeds = (state) => {
  const { feeds } = state;

  const liFeeds = feeds.reduce((acc, feed) => {
    const { contentFeed: { description, link } } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return [...acc, li];
  }, []);
  elements.getElementFeeds.innerHTML = '';
  elements.getElementFeeds.append(...liFeeds);
  elements.getElementRssChanel.value = '';
};

export const renderNews = (state) => {
  const { news } = state;

  const liNews = news.reduce((acc, item) => {
    const { item: { description, link } } = item;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return [...acc, li];
  }, []);
  elements.getElementNews.innerHTML = '';
  elements.getElementNews.append(...liNews);
};
