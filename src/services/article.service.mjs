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
  getArticles: async ({ page, limit, category, status, keyword }) => {
    const currentPage = toPositiveInt(page, 1);
    const currentLimit = toPositiveInt(limit, 10);
    const offset = (currentPage - 1) * currentLimit;

    const conditions = [];
    const values = [];

    if (category) {
      conditions.push(`p.category_id = $${values.length + 1}`);
      values.push(category);
    }

    if (status) {
      const normalizedStatus = String(status).trim().toLowerCase();
      if (normalizedStatus === "published") {
        conditions.push(`LOWER(s.status) IN ($${values.length + 1}, $${values.length + 2})`);
        values.push("published", "publish");
      } else {
        conditions.push(`LOWER(s.status) = $${values.length + 1}`);
        values.push(normalizedStatus);
      }
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

  getArticleById: async (articleId, viewerUserId = null) => {
    const article = await ArticleRepository.getArticleById(articleId, viewerUserId);
    if (!article) {
      throw createHttpError(404, "Server could not find a requested article");
    }

    return article;
  },

  createArticle: async (articleData) => {
    if (articleData.status_id == null && typeof articleData.status === "string") {
      const statusName = articleData.status.trim().toLowerCase();
      const fallbackStatusName = statusName === "published" ? "publish" : null;
      const resolvedStatusId =
        (await ArticleRepository.getStatusIdByName(statusName)) ||
        (fallbackStatusName ? await ArticleRepository.getStatusIdByName(fallbackStatusName) : null);

      if (resolvedStatusId == null) {
        throw createHttpError(400, "Status is invalid");
      }

      articleData.status_id = resolvedStatusId;
    }

    await ArticleRepository.createArticle(articleData);
  },

  updateArticleById: async (articleId, articleData) => {
    if (articleData.status_id == null && typeof articleData.status === "string") {
      const statusName = articleData.status.trim().toLowerCase();
      const fallbackStatusName = statusName === "published" ? "publish" : null;
      const resolvedStatusId =
        (await ArticleRepository.getStatusIdByName(statusName)) ||
        (fallbackStatusName ? await ArticleRepository.getStatusIdByName(fallbackStatusName) : null);

      if (resolvedStatusId == null) {
        throw createHttpError(400, "Status is invalid");
      }

      articleData.status_id = resolvedStatusId;
    }

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

  /** Records a like for a published post; same user/post only increments once. */
  likeArticle: async (articleId, userId) => {
    const article = await ArticleRepository.getArticleById(articleId, null);
    if (!article) {
      throw createHttpError(404, "Server could not find a requested article");
    }
    const normalized = String(article.status ?? "").trim().toLowerCase();
    if (normalized !== "published" && normalized !== "publish") {
      throw createHttpError(404, "Server could not find a requested article");
    }
    return ArticleRepository.addPostLike(articleId, userId);
  },
};

export default ArticleService;
