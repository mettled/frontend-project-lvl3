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
  const inputElement = elements.getElementInput();
  const buttonElement = elements.getElementButton();
  const messageElement = elements.getElementMessage();

  if (status === 'added') {
    inputElement.value = input;
  }
  buttonElement.disabled = status !== 'valid' || error;
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

const getTemplateElement = () => document.querySelector('#tmplIL').content.firstElementChild;

export const renderSources = (state) => {
  const { sources } = state;
  const elemIl = getTemplateElement();

  const nodes = sources.map((feed) => {
    const { description, link } = feed;
    const li = elemIl.cloneNode(true);
    const a = document.createElement('a');
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getElementSources().innerHTML = '';
  elements.getElementSources().append(...nodes);
};

export const renderArticles = (state) => {
  const { articles } = state;
  const elemIl = getTemplateElement();

  const nodes = articles.map(({ description, link }) => {
    const li = elemIl.cloneNode(true);
    const a = document.createElement('a');
    a.innerHTML = description;
    a.href = link;
    li.append(a);
    return li;
  });
  elements.getElementArticles().innerHTML = '';
  elements.getElementArticles().append(...nodes);
};
