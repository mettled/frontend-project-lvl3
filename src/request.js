import axios from 'axios';
import parser from './parser';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get?charset=ISO-8859-1&url=';

const getLinkWithoutProxy = (link) => (link.substring(CORS_PROXY.length));

export default (chanels) => {
  const requests = chanels.map((link) => (axios.get(`${CORS_PROXY}${link}`)));

  return Promise.all(requests)
    .then((receiveData) => (
      receiveData.map(({ data: { contents }, config: { url } }) => {
        // const content = data.data.contents;
        // const url = data.config.url;
        const { feed, items } = parser(contents);
        const link = getLinkWithoutProxy(url);
        return { feed, items, link };
      })
    ))
    .catch((error) => { throw error; });
};
