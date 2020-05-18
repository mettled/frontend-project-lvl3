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

export const renderForm = ({ statusForm, errorForm }) => {
  const inputElement = elements.getInputElement();
  const buttonElement = elements.getButtonElement();
  const messageElement = elements.getMessageElement();

  const renderingElement = (text, statusBtn = false, classAddMsg = '', classAddInput = '') => {
    messageElement.innerHTML = i18next.t(`${text}`);
    buttonElement.disabled = statusBtn;
    inputElement.classList.value = `form-control ${classAddInput}`;
    messageElement.classList.value = `form-text ${classAddMsg}`;
  };

  switch (statusForm) {
    case STATUS.ERROR:
      renderingElement(`errors.${errorForm}`, true, 'text-danger', 'is-invalid');
      break;
    case STATUS.EMPTY:
      renderingElement(`status.${statusForm}`, true, 'text-muted', '');
      break;
    case STATUS.WAIT:
      renderingElement(`status.${statusForm}`, true, 'text-muted', 'is-valid');
      break;
    case STATUS.VALID:
      renderingElement(`status.${statusForm}`, false, 'text-success', 'is-valid');
      break;
    case STATUS.ADDED:
      renderingElement(`status.${statusForm}`, true, 'text-muted', '');
      inputElement.value = '';
      break;
    default:
      renderingElement(`status.${statusForm}`, true, 'text-muted', '');
      break;
  }
};

const getTemplateElement = () => document.querySelector('#template-list').content.firstElementChild;

export const renderSources = ({ sources }) => {
  const liElement = getTemplateElement();

  const nodes = sources.map(({ description, link }) => {
    const li = liElement.cloneNode(true);
    const a = li.firstElementChild;
    a.innerHTML = description || link;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getSourcesElement().innerHTML = '';
  elements.getSourcesElement().append(...nodes);
};

export const renderArticles = ({ articles }) => {
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
