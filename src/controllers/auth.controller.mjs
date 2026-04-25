import AuthService from "../services/auth.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const AuthController = {
  register: async (req, res) => {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "An error occurred during registration"
      );
    }
  },

  login: async (req, res) => {
    try {
      const accessToken = await AuthService.login(req.body);
      return res.status(200).json({
        message: "Signed in successfully",
        access_token: accessToken,
      });
    } catch (error) {
      return handleControllerError(res, error, "An error occurred during login");
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await AuthService.getUser(req.authToken);
      return res.status(200).json(user);
    } catch (error) {
      return handleControllerError(res, error, "Internal server error");
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const result = await AuthService.resetPassword(req.authToken, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return res.status(200).json(result);
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "An error occurred while resetting password",
      );
    }
  },
};

export default AuthController;
