import { object, string } from 'yup';
import { STATUS } from './constants';

const validate = (value, storage) => {
  const scemaOfValidation = object({
    value: string()
      .url(STATUS.INCORRECT)
      .test({
        name: 'Dublicate check link',
        message: STATUS.DUBLICATE,
        params: { storage },
        test: (checkLink) => (!Array.from(storage).find(({ link }) => link === checkLink)),
      }),
  });

  try {
    scemaOfValidation
      .validateSync({ value });
    return { resultValidation: STATUS.VALID };
  } catch (e) {
    return { resultValidation: e.message };
  }
};

export default validate;
