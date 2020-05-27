const parseArticle = (element) => ({
  title: element.querySelector('title').textContent,
  description: element.querySelector('description').textContent,
  link: element.querySelector('link').textContent,
});

const parse = (content) => {
  try {
    const parsedData = new DOMParser().parseFromString(content, 'text/xml');
    const source = {
      title: parsedData.querySelector('title').textContent,
      description: parsedData.querySelector('description').textContent,
    };

    const items = parsedData.querySelectorAll('item') || [];
    const articles = [...items].map(parseArticle);
    return { source, articles };
  } catch (e) {
    return null;
  }
};

export default parse;
