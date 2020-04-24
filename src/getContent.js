import axios from 'axios';
import parser from './parser';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get?charset=ISO-8859-1&url=';

export default (links) => {
  const requests = links.map((link) => (axios.get(`${CORS_PROXY}${link}`)));
  return Promise.all(requests)
    .then((receiveData) => (
      receiveData.map(({ data: { contents, status: { url } } }) => {
        const {
          source: {
            title, description,
          }, articles,
        } = parser(contents);
        return { source: { title, description, link: url }, articles };
      })
    ))
    .catch((error) => {
      throw error;
    });
};
