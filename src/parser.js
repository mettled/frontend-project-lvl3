
const parseElement = (element) => ({
  title: element.querySelector('title').textContent,
  description: element.querySelector('description').textContent,
  link: element.querySelector('link').textContent,
});

export default (content) => {
  const parseredData = new DOMParser().parseFromString(content, 'text/xml');
  const source = {
    title: parseredData.querySelector('title').textContent,
    description: parseredData.querySelector('description').textContent,
  };

  const itemsCollection = parseredData.querySelectorAll('item');
  const articles = [...itemsCollection].map(parseElement);
  return { source, articles };
};
