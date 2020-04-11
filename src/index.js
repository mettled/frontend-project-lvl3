import 'bootstrap/dist/css/bootstrap.min.css';
import { uniqueId } from 'lodash';
import watch from './watch';
import request from './request';
import State from './helpers/state';
import validate from './validate';

const PERIOD_REQUEST = 5000;
let timerID;

const stateApp = new State({
  action: '',
  error: '',
  isValid: null,
  feeds: [],
  news: [],
});

// http://lorem-rss.herokuapp.com/feed
// http://feeds.bbci.co.uk/news/video_and_audio/uk/rss.xml
// http://billmaher.hbo.libsynpro.com/rss
//  const newLinks = ['http://lorem-rss.herokuapp.com/feed', 'http://feeds.bbci.co.uk/news/video_and_audio/uk/rss.xml', 'http://billmaher.hbo.libsynpro.com/rss'];

const findLink = (checkFeed, starageParam) => (
  Array.from(starageParam).find(({ link }) => link === checkFeed)
);

const controlFeedContent = (data, state) => {
  data.forEach((content) => {
    const { feed, items, link } = content;
    const findedFeed = findLink(link, state.getState('feeds'));
    const uniqFeedID = findedFeed ? findedFeed.id : undefined;
    if (!uniqFeedID) {
      const unuqID = uniqueId();
      const itemsWithID = items.map((item) => ({ feedId: uniqFeedID, item }));
      state.setState({
        feeds: [{ id: unuqID, contentFeed: feed, link }],
        news: itemsWithID,
      });
    } else {
      const itemsWithID = items.map((item) => ({ feedId: uniqFeedID, item }));
      state.setState({ news: itemsWithID });
    }
  });
};

const getContent = (links, periodRequest = false) => {
  const requestLinks = !periodRequest ? [links] : stateApp.getState('feeds').map(({ link }) => link);
  request(requestLinks)
    .then((data) => {
      const newState = periodRequest ? { news: [] } : { action: 'feedWasAdded', error: '' };
      stateApp.setState(newState);

      controlFeedContent(data, stateApp);
    })
    .catch((e) => {
      stateApp.setState({ action: 'errorNetwork', error: e.message });
    })
    .finally(() => {
      const errorRequest = stateApp.setState('error');
      if (!errorRequest) {
        timerID = setTimeout(getContent, PERIOD_REQUEST, [], true);
      } else {
        clearTimeout(timerID);
      }
    });
};

const onContentInput = (event) => {
  const { value: url } = event.target;
  try {
    const { error: errorValidation } = validate(url);
    if (errorValidation) {
      throw new Error(errorValidation);
    }
    stateApp.setState({ isValid: true, action: 'checkValid', error: '' });
  } catch (e) {
    stateApp.setState({ isValid: false, action: 'checkValid', error: e.message });
  }
};

const onContentSubmit = (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const link = form.get('url');

  if (!stateApp.getState('isValid')) {
    return;
  }
  if (findLink(link, stateApp.getState('feeds'))) {
    stateApp.setState({ action: 'chanelExist' });
    return;
  }
  getContent(link, false);
};

watch(stateApp.getState());

document.querySelector('#rssChanel input')
  .addEventListener('input', onContentInput);

document.querySelector('#rssChanel')
  .addEventListener('submit', onContentSubmit);
