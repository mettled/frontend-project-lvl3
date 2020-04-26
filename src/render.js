import i18next from 'i18next';

const elements = {
  getElementForm: () => document.querySelector('#rssChanel'),
  getElementInput: () => elements.getElementForm().querySelector('[name="url"]'),
  getElementButton: () => elements.getElementForm().querySelector('[name="submit"]'),
  getElementMessage: () => elements.getElementForm().querySelector('[name="message"]'),
  getElementSources: () => document.querySelector('#sources'),
  getElementArticles: () => document.querySelector('#articles'),
};

export const renderForm = (state) => {
  const {
    status, error, input,
  } = state;

  if (status === 'added') {
    elements.getElementInput().value = input;
  }
  elements.getElementButton().disabled = status !== 'valid' || error;
  if (error) {
    elements.getElementMessage().innerHTML = `${i18next.t(`errors.${error}`)}`;

    elements.getElementInput().classList.remove('is-valid');
    elements.getElementInput().classList.add('is-invalid');
    elements.getElementMessage().classList.remove('valid-feedback');
    elements.getElementMessage().classList.add('invalid-feedback');
  } else {
    elements.getElementMessage().innerHTML = `${i18next.t(`status.${status}`)}`;

    elements.getElementInput().classList.remove('is-invalid');
    elements.getElementInput().classList.add('is-valid');
    elements.getElementMessage().classList.remove('invalid-feedback');
    elements.getElementMessage().classList.add('valid-feedback');
  }
};

export const renderSources = (state) => {
  const { sources } = state;

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
};

export const renderArticles = (state) => {
  const { articles } = state;
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
};
