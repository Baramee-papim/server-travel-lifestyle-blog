import ArticleService from "../services/article.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const isPublishedStatus = (status) => {
  const normalized = String(status ?? "").trim().toLowerCase();
  return normalized === "published" || normalized === "publish";
};

const ArticleController = {
  /** Public list: always published only (ignore client status). */
  getPublicArticles: async (req, res) => {
    try {
      const articlesResult = await ArticleService.getArticles({
        ...req.query,
        status: "published",
      });
      return res.status(200).json(articlesResult);
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read article because database connection"
      );
    }
  },

  /** Public detail: 404 if not published. */
  getPublicArticleById: async (req, res) => {
    try {
      const article = await ArticleService.getArticleById(req.params.articleId);
      if (!isPublishedStatus(article.status)) {
        return res.status(404).json({
          message: "Server could not find a requested article",
          error: "Server could not find a requested article",
        });
      }
      return res.status(200).json({ data: article });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read article because database connection"
      );
    }
  },

  getArticles: async (req, res) => {
    try {
      const articlesResult = await ArticleService.getArticles(req.query);
      return res.status(200).json(articlesResult);
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read article because database connection"
      );
    }
  },

  getArticleById: async (req, res) => {
    try {
      const article = await ArticleService.getArticleById(req.params.articleId);
      return res.status(200).json({ data: article });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read article because database connection"
      );
    }
  },

  createArticle: async (req, res) => {
    try {
      await ArticleService.createArticle(req.body);
      return res.status(201).json({ message: "Created article successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not create article because database connection"
      );
    }
  },

  updateArticleById: async (req, res) => {
    try {
      await ArticleService.updateArticleById(req.params.articleId, req.body);
      return res.status(200).json({ message: "Updated article successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not update article because database connection"
      );
    }
  },

  deleteArticleById: async (req, res) => {
    try {
      await ArticleService.deleteArticleById(req.params.articleId);
      return res.status(200).json({ message: "Deleted article successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not delete article because database connection"
      );
    }
  },
};

export default ArticleController;
