import { Router } from "express";
import CategoryController from "../controllers/category.controller.mjs";

const categoryRoute = Router();

categoryRoute.get("/", CategoryController.getCategories);

export default categoryRoute;
