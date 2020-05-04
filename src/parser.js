
const parseNews = (element) => ({
  title: element.querySelector('title').textContent,
  description: element.querySelector('description').textContent,
  link: element.querySelector('link').textContent,
});

export default (content) => {
  const parsedData = new DOMParser().parseFromString(content, 'text/xml');
  const source = {
    title: parsedData.querySelector('title').textContent,
    description: parsedData.querySelector('description').textContent,
  };

  const news = parsedData.querySelectorAll('item') || [];
  const articles = [...news].map(parseNews);
  return { source, articles };
};
