import axios from 'axios';
import parse from './parse';
import { ERRORS } from './constants';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get?charset=ISO-8859-1&url=';

const fetchArticles = (links) => {
  const requests = links.map((link) => axios.get(`${CORS_PROXY}${link}`));

  return Promise.all(requests)
    .then((responses) => (
      responses.map(({ data: { contents, status: { url } } }) => {
        try {
          const {
            source: {
              title, description,
            }, articles,
          } = parse(contents);

          return { source: { title, description, link: url }, articles };
        } catch {
          throw new Error(ERRORS.NOFEED);
        }
      })
    ));
};

export default fetchArticles;
