export const checkLink = (checkingLink, storage) => (
  storage.find(({ link }) => link === checkingLink)
);

export const getNewArticles = (articles, storage) => (
  articles.filter(({ link }) => !storage.find((storageLink) => link === storageLink))
);

export const addIDToArticles = (id, articles) => (
  articles.map(({ title, description, link }) => ({
    sourceId: id, title, description, link,
  }))
);

export const makeSourceItem = (id, source) => ({
  id, ...source,
});
