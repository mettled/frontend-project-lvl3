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
  news: [ {feedId: 3, title: "Coronavirus: The UK's Easter lockdown from above", description: "Many areas in the UK seem to be following the gove…advice, with relatively empty beaches and parks .", link: "https://www.bbc.co.uk/news/uk-52249942"} ],
});

// http://lorem-rss.herokuapp.com/feed
// http://feeds.bbci.co.uk/news/video_and_audio/uk/rss.xml
// http://billmaher.hbo.libsynpro.com/rss
//  const newLinks = ['http://lorem-rss.herokuapp.com/feed', 'http://feeds.bbci.co.uk/news/video_and_audio/uk/rss.xml', 'http://billmaher.hbo.libsynpro.com/rss'];

const findLink = (checkFeed, starageParam) => (
  Array.from(starageParam).find(({ link }) => link === checkFeed)
);

const undateStateContent = (data, state) => {
  data.forEach((content) => {
    const { feed: {
      title: feedTitle, description: feedDescription, link: feedLink,
    }, items } = content;

    const findedFeed = findLink(feedLink, state.getState('feeds'));
    const uniqID = !findedFeed ? uniqueId() : findedFeed.id;

    if (!findedFeed) {
      state.setState({ feeds: [{
        id: uniqID,
        title: feedTitle,
        description: feedDescription,
        link: feedLink,
      }] });
    }

    const filteredItems = items.filter(({ link }) => (!findLink(link, state.getState('news'))));
    const itemsWithID = filteredItems.map(( { title, description, link } ) => ( { feedId: uniqID, title, description, link } ));
    if (itemsWithID.length > 0) {
      state.setState({ news: itemsWithID });
    }
  });
};

const getContent = (links, periodRequest = false) => {
  const requestLinks = !periodRequest ? [links] : stateApp.getState('feeds').map(({ link }) => link);
  console.log('requestLinks', requestLinks)
  request(requestLinks)
    .then((data) => {
      undateStateContent(data, stateApp);
      // const newState = periodRequest ? { news: [] } : { action: 'feedWasAdded', error: '' };
      stateApp.setState({ action: 'feedWasAdded' });
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
      console.log('repeat', stateApp.getState('news'))
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
  clearTimeout(timerID);
  getContent(link, false);
};

watch(stateApp.getState());

document.querySelector('#rssChanel input')
  .addEventListener('input', onContentInput);

document.querySelector('#rssChanel')
  .addEventListener('submit', onContentSubmit);
