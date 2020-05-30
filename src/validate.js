import { object, string } from 'yup';
import { ERRORS } from './constants';

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
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
};

export default validate;
