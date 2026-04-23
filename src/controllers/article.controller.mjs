import ArticleService from "../services/article.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const ArticleController = {
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
