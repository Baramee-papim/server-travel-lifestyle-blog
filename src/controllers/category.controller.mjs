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
};

export default CategoryController;
