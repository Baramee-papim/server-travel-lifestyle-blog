import { Router } from "express";
import ArticleMiddleware from "../middleware/article.middleware.mjs";
import ArticleController from "../controllers/article.controller.mjs";

const articleRoute = Router();

articleRoute.get("/", ArticleController.getArticles);

articleRoute.get(
  "/:articleId",
  [ArticleMiddleware.validateArticleId],
  ArticleController.getArticleById
);

articleRoute.post(
  "/",
  [ArticleMiddleware.validateArticleData],
  ArticleController.createArticle
);

articleRoute.put(
  "/:articleId",
  [ArticleMiddleware.validateArticleId, ArticleMiddleware.validateArticleData],
  ArticleController.updateArticleById
);

articleRoute.delete(
  "/:articleId",
  [ArticleMiddleware.validateArticleId],
  ArticleController.deleteArticleById
);

export default articleRoute;
