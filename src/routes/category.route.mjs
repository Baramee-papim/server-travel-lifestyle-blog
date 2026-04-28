import { Router } from "express";
import CategoryController from "../controllers/category.controller.mjs";
import CategoryMiddleware from "../middleware/category.middleware.mjs";

const categoryRoute = Router();

categoryRoute.get("/", CategoryController.getCategories);
categoryRoute.post("/", [CategoryMiddleware.validateCategoryData], CategoryController.createCategory);
categoryRoute.put(
  "/:categoryId",
  [CategoryMiddleware.validateCategoryId, CategoryMiddleware.validateCategoryData],
  CategoryController.updateCategoryById,
);
categoryRoute.delete(
  "/:categoryId",
  [CategoryMiddleware.validateCategoryId],
  CategoryController.deleteCategoryById,
);

export default categoryRoute;
