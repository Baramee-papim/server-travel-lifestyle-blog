import { Router } from "express";
import AuthController from "../controllers/auth.controller.mjs";
import AuthMiddleware from "../middleware/auth.middleware.mjs";

const authRoute = Router();

const AuthRouteHandlers = {
  register: [AuthMiddleware.validateRegisterData, AuthController.register],
  login: [AuthMiddleware.validateLoginData, AuthController.login],
  getUser: [AuthMiddleware.validateAuthToken, AuthController.getUser],
  resetPassword: [
    AuthMiddleware.validateAuthToken,
    AuthMiddleware.validateResetPasswordData,
    AuthController.resetPassword,
  ],
};

authRoute.post("/register", AuthRouteHandlers.register);
authRoute.post("/login", AuthRouteHandlers.login);
authRoute.get("/get-user", AuthRouteHandlers.getUser);
authRoute.post("/reset-password", AuthRouteHandlers.resetPassword);

export default authRoute;
