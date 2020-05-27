import i18next from 'i18next';
import classNames from 'classnames';
import { STATUS } from '../constants';
import './index.css';

const formElement = document.querySelector('#rssChannel');
const inputElement = formElement.querySelector('[name="url"]');
const buttonElement = formElement.querySelector('[name="submit"]');
const messageElement = formElement.querySelector('[name="message"]');
const sourceElement = document.querySelector('#sources');
const articlesElement = document.querySelector('#articles');
const templateElement = document
  .querySelector('#template-list')
  .content
  .firstElementChild;

const renderingElement = (text, statusBtn = false, classAddMsg = '', classAddInput = '') => {
  messageElement.innerHTML = i18next.t(`${text}`);
  buttonElement.disabled = statusBtn;
  inputElement.classList.value = classNames('form-control', `${classAddInput}`);
  messageElement.classList.value = classNames('form-text', `${classAddMsg}`);
};

export const renderForm = ({ form: { status, error } }) => {
  switch (status) {
    case STATUS.ERROR:
      renderingElement(`errors.${error}`, true, 'text-danger', 'is-invalid');
      break;
    case STATUS.EMPTY:
      renderingElement(`status.${status}`, true, 'text-muted');
      break;
    case STATUS.WAIT:
      renderingElement(`status.${status}`, true, 'text-muted', 'is-valid');
      break;
    case STATUS.VALID:
      renderingElement(`status.${status}`, false, 'text-success', 'is-valid');
      break;
    case STATUS.ADDED:
      renderingElement(`status.${status}`, true, 'text-muted');
      inputElement.value = '';
      break;
    default:
      throw new Error(`Unknown status form: '${status}'`);
  }
};

export const renderSources = ({ sources }) => {
  const nodes = sources.map(({ description, link, status }) => {
    const templateLiElement = templateElement.cloneNode(true);
    const li = templateLiElement;
    const a = templateLiElement.firstElementChild;
    a.innerHTML = description || link;
    a.href = link;
    a.classList.value = classNames({ 'no-source': !status, 'ok-source': status });
    li.append(a);
    return li;
  });
  sourceElement.innerHTML = '';
  sourceElement.append(...nodes);
};

export const renderArticles = ({ articles }) => {
  const nodes = articles.map(({ description, link }) => {
    const templateLiElement = templateElement.cloneNode(true);
    const li = templateLiElement;
    const a = templateLiElement.firstElementChild;
    a.innerHTML = description || link;
    a.href = link;
    li.append(a);
    return li;
  });
  articlesElement.innerHTML = '';
  articlesElement.append(...nodes);
};
