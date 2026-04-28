import CategoryService from "../services/category.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const CategoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await CategoryService.getCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read categories because database connection",
      );
    }
  },

  createCategory: async (req, res) => {
    try {
      await CategoryService.createCategory(req.body);
      return res.status(201).json({ message: "Created category successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not create category because database connection",
      );
    }
  },

  updateCategoryById: async (req, res) => {
    try {
      await CategoryService.updateCategoryById(req.params.categoryId, req.body);
      return res.status(200).json({ message: "Updated category successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not update category because database connection",
      );
    }
  },

  deleteCategoryById: async (req, res) => {
    try {
      await CategoryService.deleteCategoryById(req.params.categoryId);
      return res.status(200).json({ message: "Deleted category successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not delete category because database connection",
      );
    }
  },
};

export default CategoryController;
