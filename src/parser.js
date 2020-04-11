export default (content) => {
  const parseredInformation = (element) => ({
    title: element.querySelector('title').textContent,
    description: element.querySelector('description').textContent,
    link: element.querySelector('link').textContent,
  });
  const parseredData = new DOMParser().parseFromString(content, 'text/xml');
  const feed = parseredInformation(parseredData);
  const itemsCollection = parseredData.querySelectorAll('item');
  const items = [...itemsCollection].map(parseredInformation);

  return { feed, items };
};
