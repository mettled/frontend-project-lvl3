import { object, string } from 'yup';

export default (value, storage) => {
  const scemaOfValidation = object({
    value: string()
      .url()
      .test({
        name: 'Dublicate check link',
        message: 'Link is present in RSS list',
        params: { storage },
        test: (checkLink) => (!Array.from(storage).find(({ link }) => link === checkLink)),
      }),
  });

  return scemaOfValidation
    .isValidSync({ value });
};
