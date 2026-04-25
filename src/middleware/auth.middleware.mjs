const isMissing = (value) => value === undefined || value === null;

const isBlankString = (value) =>
  typeof value === "string" && value.trim().length === 0;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const AuthMiddleware = {
  validateRegisterData: (req, res, next) => {
    const { email, password, username, name } = req.body;
    const errors = [];

    if (isMissing(email)) {
      errors.push("Email is required");
    } else if (typeof email !== "string" || isBlankString(email)) {
      errors.push("Email must be a non-empty string");
    } else if (!isValidEmail(email)) {
      errors.push("Email format is invalid");
    }

    if (isMissing(password)) {
      errors.push("Password is required");
    } else if (typeof password !== "string" || isBlankString(password)) {
      errors.push("Password must be a non-empty string");
    } else if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (isMissing(username)) {
      errors.push("Username is required");
    } else if (typeof username !== "string" || isBlankString(username)) {
      errors.push("Username must be a non-empty string");
    } else if (username.trim().length < 3) {
      errors.push("Username must be at least 3 characters");
    }

    if (isMissing(name)) {
      errors.push("Name is required");
    } else if (typeof name !== "string" || isBlankString(name)) {
      errors.push("Name must be a non-empty string");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    return next();
  },

  validateLoginData: (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (isMissing(email)) {
      errors.push("Email is required");
    } else if (typeof email !== "string" || isBlankString(email)) {
      errors.push("Email must be a non-empty string");
    } else if (!isValidEmail(email)) {
      errors.push("Email format is invalid");
    }

    if (isMissing(password)) {
      errors.push("Password is required");
    } else if (typeof password !== "string" || isBlankString(password)) {
      errors.push("Password must be a non-empty string");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    return next();
  },

  validateResetPasswordData: (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const errors = [];

    if (isMissing(currentPassword)) {
      errors.push("currentPassword is required");
    } else if (
      typeof currentPassword !== "string" ||
      isBlankString(currentPassword)
    ) {
      errors.push("currentPassword must be a non-empty string");
    }

    if (isMissing(newPassword)) {
      errors.push("newPassword is required");
    } else if (typeof newPassword !== "string" || isBlankString(newPassword)) {
      errors.push("newPassword must be a non-empty string");
    } else if (newPassword.length < 6) {
      errors.push("newPassword must be at least 6 characters");
    }

    if (isMissing(confirmPassword)) {
      errors.push("confirmPassword is required");
    } else if (
      typeof confirmPassword !== "string" ||
      isBlankString(confirmPassword)
    ) {
      errors.push("confirmPassword must be a non-empty string");
    }

    if (
      typeof newPassword === "string" &&
      typeof confirmPassword === "string" &&
      newPassword !== confirmPassword
    ) {
      errors.push("newPassword and confirmPassword do not match");
    }

    if (
      typeof currentPassword === "string" &&
      typeof newPassword === "string" &&
      currentPassword === newPassword
    ) {
      errors.push("newPassword must be different from currentPassword");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    return next();
  },

  validateAuthToken: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Invalid token format" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    req.authToken = token;
    return next();
  },
};

export default AuthMiddleware;
