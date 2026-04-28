import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.mjs";
import UploadMiddleware from "../middleware/upload.middleware.mjs";
import UploadController from "../controllers/upload.controller.mjs";

const uploadRoute = Router();

uploadRoute.post(
  "/article-image",
  [
    AuthMiddleware.validateAuthToken,
    UploadMiddleware.uploadArticleImage,
    UploadMiddleware.handleUploadError,
  ],
  UploadController.uploadArticleImage,
);

uploadRoute.post(
  "/profile-image",
  [
    AuthMiddleware.validateAuthToken,
    UploadMiddleware.uploadArticleImage,
    UploadMiddleware.handleUploadError,
  ],
  UploadController.uploadProfileImage,
);

export default uploadRoute;
