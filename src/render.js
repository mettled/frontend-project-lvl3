import i18next from 'i18next';
import { STATUS } from './constants';

const elements = {
  getFormElement: () => document.querySelector('#rssChannel'),
  getInputElement: () => elements.getFormElement().querySelector('[name="url"]'),
  getButtonElement: () => elements.getFormElement().querySelector('[name="submit"]'),
  getMessageElement: () => elements.getFormElement().querySelector('[name="message"]'),
  getSourcesElement: () => document.querySelector('#sources'),
  getArticlesElement: () => document.querySelector('#articles'),
};

export const renderForm = (state) => {
  const {
    status, error,
  } = state;
  const inputElement = elements.getInputElement();
  const buttonElement = elements.getButtonElement();
  const messageElement = elements.getMessageElement();

  switch (status) {
    case STATUS.EMPTY:
      buttonElement.disabled = !!error;
      break;
    case STATUS.VALID:
      buttonElement.disabled = false;
      break;
    case STATUS.INCORRECT:
      buttonElement.disabled = !!error;
      break;
    case STATUS.DUBLICATE:
      buttonElement.disabled = !!error;
      break;
    case STATUS.ADDED:
      inputElement.value = '';
      break;
    default:
      buttonElement.disabled = false;
      break;
  }

  if (error) {
    messageElement.innerHTML = `${i18next.t(`errors.${error}`)}`;

    inputElement.classList.remove('is-valid');
    inputElement.classList.add('is-invalid');
    messageElement.classList.remove('valid-feedback');
    messageElement.classList.add('invalid-feedback');
  } else {
    messageElement.innerHTML = `${i18next.t(`status.${status}`)}`;

    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');
    messageElement.classList.remove('invalid-feedback');
    messageElement.classList.add('valid-feedback');
  }
};

const getTemplateElement = () => document.querySelector('#template-list').content.firstElementChild;

export const renderSources = (state) => {
  const { sources } = state;
  const liElement = getTemplateElement();

  const nodes = sources.map(({ description, link }) => {
    const li = liElement.cloneNode(true);
    const a = li.firstElementChild;
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getSourcesElement().innerHTML = '';
  elements.getSourcesElement().append(...nodes);
};

export const renderArticles = (state) => {
  const { articles } = state;
  const liElement = getTemplateElement();

  const nodes = articles.map(({ description, link }) => {
    const li = liElement.cloneNode(true);
    const a = li.firstElementChild;
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getArticlesElement().innerHTML = '';
  elements.getArticlesElement().append(...nodes);
};
