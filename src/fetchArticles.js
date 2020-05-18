import axios from 'axios';
import parse from './parse';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get?charset=ISO-8859-1&url=';

const fetchArticles = (links) => {
  const requests = links.map((link) => axios.get(`${CORS_PROXY}${link}`));
  return Promise.allSettled(requests)
    .then((responses) => (
      responses
        .filter(({ status }) => status === 'fulfilled')
        .map(({ value: { data: { contents, status: { url } } } }) => {
          const {
            isRSS,
            source,
            articles,
          } = parse(contents);

          return {
            isRSS,
            source: { ...source, link: url },
            articles,
          };
        })
    ));
};

export default fetchArticles;
