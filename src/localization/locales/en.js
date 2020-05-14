import { STATUS, ERRORS } from '../../constants';

export default {
  translation: {
    errors: {
      [ERRORS.EMPTY]: '',
      [ERRORS.NETWORK]: 'Check network connection OR link doesnt contain RSS-feed',
    },
    status: {
      [STATUS.EMPTY]: 'Please add RSS channel',
      [STATUS.VALID]: 'Channel is valid',
      [STATUS.WAIT]: 'Waiting....',
      [STATUS.ADDED]: 'Channel was added',
      [STATUS.INCORRECT]: 'Please enter correct link',
      [STATUS.DUBLICATE]: 'Please enter another link, it was already added',
      [STATUS.ERROR]: '',
    },
  },
};
