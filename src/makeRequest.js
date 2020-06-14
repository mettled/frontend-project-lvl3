import axios from 'axios';

// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get?charset=ISO-8859-1&url=';

const makeRequest = (link) => {
  const linkWithProxy = `${CORS_PROXY}${link}`;
  return axios.get(linkWithProxy);
};

export default makeRequest;
