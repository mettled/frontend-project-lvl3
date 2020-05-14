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
    scemaOfValidation.validateSync({ value });
    return { status: STATUS.VALID };
  } catch (e) {
    return { status: e.message };
  }
};

export default validate;
