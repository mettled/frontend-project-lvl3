/*  eslint no-param-reassign: 0 */

import i18next from 'i18next';
import classNames from 'classnames';
import { STATUS } from './constants';

export const renderForm = ({
  form: { status, error },
}, {
  inputElement,
  messageElement,
  buttonElement,
}) => {
  const renderElement = (text, statusBtn = false, classAddMsg = null, classAddInput = null) => {
    messageElement.innerHTML = i18next.t(`${text}`);
    buttonElement.disabled = statusBtn;
    inputElement.classList.value = classNames(['form-control', classAddInput]);
    messageElement.classList.value = classNames(['form-text', classAddMsg]);
  };

  switch (status) {
    case STATUS.ERROR:
      renderElement(`errors.${error}`, true, 'text-danger', 'is-invalid');
      break;
    case STATUS.EMPTY:
      renderElement(`status.${status}`, true, 'text-muted');
      break;
    case STATUS.WAIT:
      renderElement(`status.${status}`, true, 'text-muted', 'is-valid');
      break;
    case STATUS.VALID:
      renderElement(`status.${status}`, false, 'text-success', 'is-valid');
      break;
    case STATUS.ADDED:
      renderElement(`status.${status}`, true, 'text-muted');
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
    if (status) {
      li.classList.add('list-group-item-danger');
    }
    const a = templateLiElement.firstElementChild;
    a.innerHTML = description || link;
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
    a.innerHTML = description || link;
    a.href = link;
    li.append(a);
    return li;
  });
  articlesElement.innerHTML = '';
  articlesElement.append(...nodes);
};
