import { STATUS, ERROR } from '../../constants';

export default {
  translation: {
    errors: {
      [ERROR.NETWORK]: 'Check network connection',
    },
    status: {
      [STATUS.EMPTY]: '',
      [STATUS.VALID]: 'Entered channel is valid',
      [STATUS.INCORRECT]: 'Please enter correct link',
      [STATUS.DUBLICATE]: 'Please enter another link, it was already added',
      [STATUS.ADDED]: 'Channel was added',
    },
  },
};
