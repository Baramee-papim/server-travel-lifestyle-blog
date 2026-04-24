import ArticleRepository from "../repositories/article.repository.mjs";

const toPositiveInt = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return defaultValue;
  }

  return parsed;
};

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const ArticleService = {
  getArticles: async ({ page, limit, category, keyword }) => {
    const currentPage = toPositiveInt(page, 1);
    const currentLimit = toPositiveInt(limit, 6);
    const offset = (currentPage - 1) * currentLimit;

    const conditions = [];
    const values = [];

    if (category) {
      conditions.push(`p.category_id = $${values.length + 1}`);
      values.push(category);
    }

    if (keyword) {
      conditions.push(`(
        p.title ILIKE $${values.length + 1} OR
        p.description ILIKE $${values.length + 1} OR
        p.content ILIKE $${values.length + 1}
      )`);
      values.push(`%${keyword}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [totalArticles, articles] = await Promise.all([
      ArticleRepository.getArticlesCount({ whereClause, values }),
      ArticleRepository.getArticles({ whereClause, values, limit: currentLimit, offset }),
    ]);

    const totalPages = Math.ceil(totalArticles / currentLimit);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      totalArticles,
      totalPages,
      currentPage,
      limit: currentLimit,
      articles,
      nextPage,
    };
  },

  getArticleById: async (articleId) => {
    const article = await ArticleRepository.getArticleById(articleId);
    if (!article) {
      throw createHttpError(404, "Server could not find a requested article");
    }

    return article;
  },

  createArticle: async (articleData) => {
    await ArticleRepository.createArticle(articleData);
  },

  updateArticleById: async (articleId, articleData) => {
    const rowCount = await ArticleRepository.updateArticleById(articleId, articleData);
    if (rowCount === 0) {
      throw createHttpError(404, "Server could not find a requested article to update");
    }
  },

  deleteArticleById: async (articleId) => {
    const rowCount = await ArticleRepository.deleteArticleById(articleId);
    if (rowCount === 0) {
      throw createHttpError(404, "Server could not find a requested article to delete");
    }
  },
};

export default ArticleService;
