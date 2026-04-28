import { Router } from "express";
import ArticleMiddleware from "../middleware/article.middleware.mjs";
import ArticleController from "../controllers/article.controller.mjs";
import CommentController from "../controllers/comment.controller.mjs";
import CommentMiddleware from "../middleware/comment.middleware.mjs";
import protectUser from "../middleware/protectUser.mjs";
import optionalAuthUser from "../middleware/optionalAuthUser.mjs";

const articleRoute = Router();

articleRoute.get("/", ArticleController.getPublicArticles);

articleRoute.get(
  "/:articleId/comments",
  [ArticleMiddleware.validateArticleId],
  CommentController.listForArticle,
);

articleRoute.post(
  "/:articleId/comments",
  [
    protectUser,
    ArticleMiddleware.validateArticleId,
    CommentMiddleware.validateCreateComment,
  ],
  CommentController.create,
);

articleRoute.post(
  "/:articleId/like",
  [protectUser, ArticleMiddleware.validateArticleId],
  ArticleController.likeArticle,
);

articleRoute.get(
  "/:articleId",
  [optionalAuthUser, ArticleMiddleware.validateArticleId],
  ArticleController.getPublicArticleById,
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
