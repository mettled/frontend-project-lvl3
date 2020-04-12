import axios from 'axios';
import parser from './parser';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get?charset=ISO-8859-1&url=';

export default (chanels) => {
  const requests = chanels.map((link) => (axios.get(`${CORS_PROXY}${link}`)));

  return Promise.all(requests)
    .then((receiveData) => (
      receiveData.map(({ data: { contents, status: { url } } }) => {
        const {
          feed: {
            title, description,
          }, items,
        } = parser(contents);
        return { feed: { title, description, link: url }, items };
      })
    ))
    .catch((error) => {
      throw error;
    });
};
