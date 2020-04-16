import { object, string } from 'yup';

const scemaOfValidation = {
  value: string()
    .url(),
};

export default (value) => (
  object(scemaOfValidation)
    .isValidSync({ value })
);
