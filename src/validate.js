import { object, string } from 'yup';

export default (value, storage) => {
  const scemaOfValidation = object({
    value: string()
      .url('incorrectLink')
      .test({
        name: 'Dublicate check link',
        message: 'dublicateLink',
        params: { storage },
        test: (checkLink) => (!Array.from(storage).find(({ link }) => link === checkLink)),
      }),
  });

  try {
    scemaOfValidation
      .validateSync({ value });
    return { resultValidation: 'valid' };
  } catch (e) {
    return { resultValidation: e.message };
  }
};
