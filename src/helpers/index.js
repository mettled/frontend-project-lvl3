export const getNewArticles = (articles, storage) => (
  articles.filter(({ link }) => !storage.find(({ link: storageLink }) => link === storageLink))
);

export const addIDToArticles = (id, articles) => (
  articles.map(({ title, description, link }) => ({
    sourceId: id, title, description, link,
  }))
);

export const addIDToSource = (id, source) => ({
  id, ...source, status: true,
});
