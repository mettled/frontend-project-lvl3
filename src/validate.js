import { object, string } from 'yup';

const scemaOfValidation = {
  value: string()
    .url()
    .required('URL adress does not be empty')
    .matches(/rss/),
};

export default (value) => {
  try {
    const result = object(scemaOfValidation)
      .validateSync({ value });
    return { value: result.value, error: null };
  } catch (e) {
    return { value, error: e.message };
  }
};
