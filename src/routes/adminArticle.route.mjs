import { Router } from "express";
import protectAdmin from "../middleware/protectAdmin.mjs";
import ArticleMiddleware from "../middleware/article.middleware.mjs";
import ArticleController from "../controllers/article.controller.mjs";

const adminArticleRoute = Router();

adminArticleRoute.get("/", protectAdmin, ArticleController.getArticles);

adminArticleRoute.get(
  "/:articleId",
  protectAdmin,
  ArticleMiddleware.validateArticleId,
  ArticleController.getArticleById
);

export default adminArticleRoute;
