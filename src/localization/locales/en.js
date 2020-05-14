import { STATUS, ERRORS } from '../../constants';

export default {
  translation: {
    errors: {
      [ERRORS.EMPTY]: '',
      [ERRORS.NETWORK]: 'Check network connection',
    },
    status: {
      [STATUS.EMPTY]: 'Please add RSS channel',
      [STATUS.VALID]: 'Entered channel is valid',
      [STATUS.WAIT]: 'Waiting....',
      [STATUS.ADDED]: 'Channel was added',
      [STATUS.INCORRECT]: 'Please enter correct link',
      [STATUS.DUBLICATE]: 'Please enter another link, it was already added',
      [STATUS.ERROR]: '',
    },
  },
};
