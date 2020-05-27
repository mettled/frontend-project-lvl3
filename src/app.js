/*  eslint no-param-reassign: 0 */

import watch from './watch';
import initLocalization from './localization';
import { addSource, updateSources } from './requests';

import validate from './validate';
import initializeState from './initializeState';
import { STATUS, ERRORS } from './constants';

const initControllers = (state) => {
  const onInput = ({ target: { value } }) => {
    state.errorForm = ERRORS.EMPTY;
    if (value.length === 0) {
      state.form.status = STATUS.EMPTY;
      return;
    }
    const { status, error } = validate(value, state.sources);
    state.form.status = status;
    state.form.error = error;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const link = form.get('url');

    state.form.status = STATUS.WAIT;
    state.form.error = ERRORS.EMPTY;
    addSource(state, link);
  };

  document.querySelector('#rssChannel input')
    .addEventListener('input', onInput);

  document.querySelector('#rssChannel')
    .addEventListener('submit', onSubmit);
};

const app = () => {
  initLocalization()
    .catch(() => {
      console.log('Something went wrong during initialization');
    })
    .finally(() => {
      const state = initializeState();
      initControllers(state);
      watch(state);
      updateSources(state);
    });
};

export default app;
