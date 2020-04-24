import i18next from 'i18next';

const elements = {
  getElementForm: () => document.querySelector('[id="rssChanel"]'),
  getElementInput: () => elements.getElementForm().querySelector('[name="url"]'),
  getElementButton: () => elements.getElementForm().querySelector('[name="submit"]'),
  getElementMessage: () => elements.getElementForm().querySelector('[name="message"]'),
  getElementSources: () => document.querySelector('[id="sources"]'),
  getElementArticles: () => document.querySelector('[id="articles"]'),
};

export const renderControls = (state) => {
  const {
    action, error, disable,
  } = state;

  elements.getElementButton().disabled = disable;
  if (error) {
    elements.getElementMessage().innerHTML = `${i18next.t(`errors.${error}`)}`;

    elements.getElementInput().classList.remove('is-valid');
    elements.getElementInput().classList.add('is-invalid');
    elements.getElementMessage().classList.remove('valid-feedback');
    elements.getElementMessage().classList.add('invalid-feedback');
  } else {
    elements.getElementMessage().innerHTML = `${i18next.t(`state.${action}`)}`;

    elements.getElementInput().classList.remove('is-invalid');
    elements.getElementInput().classList.add('is-valid');
    elements.getElementMessage().classList.remove('invalid-feedback');
    elements.getElementMessage().classList.add('valid-feedback');
  }
};

export const renderSources = (state) => {
  const { sources, disable, activeLink } = state;

  const liSources = sources.map((feed) => {
    const { description, link } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getElementSources().innerHTML = '';
  elements.getElementSources().append(...liSources);
  elements.getElementInput().value = activeLink;
  elements.getElementButton().disabled = disable;
};

export const renderArticles = (state) => {
  const { articles, disable } = state;
  const liArticles = articles.map(({ description, link }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getElementArticles().innerHTML = '';
  elements.getElementArticles().append(...liArticles);
  elements.getElementButton().disabled = disable;
};
