import i18next from 'i18next';
import resources from './locales';

i18next.init({
  lng: 'en',
  debug: true,
  resources,
});

const elements = {
  getElementInput: document.querySelector('[id="rssChanel"] input'),
  getElementButton: document.querySelector('[id="rssChanel"] button[type="submit"]'),
  getElementFeeds: document.querySelector('[id="feeds"]'),
  getElementNews: document.querySelector('[id="news"]'),
  getElementMessage: document.querySelector('[id="rssMessage"]'),
};

const getStateValidation = (isValid) => i18next.t(isValid ? 'valid' : 'invalid');

export const renderControls = (state) => {
  const {
    isValid, action, error,
  } = state;
  if (error) {
    elements.getElementInput.classList.remove('is-valid');
    elements.getElementInput.classList.add('is-invalid');
    elements.getElementButton.disabled = true;
    elements.getElementMessage.classList.remove('valid-feedback');
    elements.getElementMessage.classList.add('invalid-feedback');

    elements.getElementMessage.innerHTML = `${i18next.t(`state.${action}`, { validation: getStateValidation(isValid) })} ${error}`;
    return;
  }
  if (action === 'feedWasAdded' || action === 'waitEnter') {
    elements.getElementButton.disabled = true;
  } else {
    elements.getElementButton.disabled = false;
  }
  elements.getElementInput.classList.remove('is-invalid');
  elements.getElementInput.classList.add('is-valid');

  elements.getElementMessage.classList.remove('invalid-feedback');
  elements.getElementMessage.classList.add('valid-feedback');
  elements.getElementMessage.innerHTML = `${i18next.t(`state.${action}`, { validation: getStateValidation(isValid) })}`;
};

export const renderFeeds = (state) => {
  elements.getElementButton.disabled = true;
  const { feeds } = state;

  const liFeeds = feeds.reduce((acc, feed) => {
    const { description, link } = feed;
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
  elements.getElementInput.value = '';
  elements.getElementButton.disabled = false;
};

export const renderNews = (state) => {
  const { news } = state;

  const liNews = news.reduce((acc, { description, link }) => {
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
  elements.getElementButton.disabled = false;
};
