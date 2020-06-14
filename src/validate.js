import * as yup from 'yup';
import { errors } from './constants';

const validate = (value, storage) => {
  const links = storage.map(({ link }) => link);
  const scemaOfValidation = yup
    .string()
    .url(errors.INCORRECT)
    .notOneOf(links, errors.DUBLICATE);

  try {
    scemaOfValidation.validateSync(value);
    return null;
  } catch (e) {
    return e.message;
  }
};

export default validate;
