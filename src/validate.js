import { object, string } from 'yup';
import { STATUS, ERRORS } from './constants';

const validate = (value, links) => {
  const scemaOfValidation = object({
    value: string()
      .url(ERRORS.INCORRECT)
      .test({
        name: 'Dublicate check link',
        message: ERRORS.DUBLICATE,
        params: { links },
        test: (checkLink) => (
          !links.find(({ link }) => link === checkLink)
        ),
      }),
  });

  try {
    scemaOfValidation.validateSync({ value });
    return { status: STATUS.VALID, error: ERRORS.EMPTY };
  } catch (e) {
    return { status: STATUS.ERROR, error: e.message };
  }
};

export default validate;
