const isMissing = (value) => value === undefined || value === null;

const CategoryMiddleware = {
  validateCategoryId: (req, res, next) => {
    const categoryId = Number(req.params.categoryId);
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).json({
        message: "Category ID must be a positive integer",
      });
    }

    return next();
  },

  validateCategoryData: (req, res, next) => {
    const data = req.body;
    const errors = [];

    if (isMissing(data.name)) {
      errors.push("Category name is required");
    } else if (typeof data.name !== "string") {
      errors.push("Category name must be a string");
    } else if (data.name.trim() === "") {
      errors.push("Category name cannot be empty");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    return next();
  },
};

export default CategoryMiddleware;
