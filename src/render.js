/*  eslint no-param-reassign: 0 */

import i18next from 'i18next';
import classNames from 'classnames';
import { statuses, errors } from './constants';

export const renderForm = ({
  form: { status, error },
}, {
  inputElement,
  messageElement,
  buttonElement,
}) => {
  const renderElement = (text, statusBtn = false, classAddMsg, classAddInput) => {
    messageElement.innerHTML = i18next.t(`${text}`);
    buttonElement.disabled = statusBtn;
    inputElement.classList.value = classNames(['form-control', classAddInput]);
    messageElement.classList.value = classNames(['form-text', classAddMsg]);
  };

  switch (status) {
    case statuses.ERROR:
      renderElement(`errors.${error}`, true, 'text-danger', 'is-invalid');
      break;
    case statuses.EMPTY:
      renderElement('statuses.empty', true, 'text-muted');
      break;
    case statuses.WAIT:
      renderElement('statuses.wait', true, 'text-muted', 'is-valid');
      break;
    case statuses.VALID:
      renderElement('statuses.valid', false, 'text-success', 'is-valid');
      break;
    case statuses.ADDED:
      renderElement('statuses.added', true, 'text-muted');
      inputElement.value = '';
      break;
    default:
      throw new Error(`Unknown status form: '${status}'`);
  }
};

export const renderSources = ({ sources }, { sourcesElement, templateElement }) => {
  const nodes = sources.map(({ description, link, status }) => {
    const templateLiElement = templateElement.cloneNode(true);
    const li = templateLiElement;

    li.classList.value = classNames({
      'list-group-item': true,
      'list-group-item-danger': status === statuses.NO_CONNECT,
      'list-group-item-warning': status === errors.NO_FEED,
    });

    const a = templateLiElement.firstElementChild;
    a.textContent = description || link;
    a.href = link;
    li.append(a);
    return li;
  });
  sourcesElement.innerHTML = '';
  sourcesElement.append(...nodes);
};

export const renderArticles = ({ articles }, { articlesElement, templateElement }) => {
  const nodes = articles.map(({ description, link }) => {
    const templateLiElement = templateElement.cloneNode(true);
    const li = templateLiElement;
    const a = templateLiElement.firstElementChild;
    a.textContent = description || link;
    a.href = link;
    li.append(a);
    return li;
  });
  articlesElement.innerHTML = '';
  articlesElement.append(...nodes);
};
