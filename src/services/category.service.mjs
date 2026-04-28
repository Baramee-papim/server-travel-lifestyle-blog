import CategoryRepository from "../repositories/category.repository.mjs";

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const CategoryService = {
  getCategories: async () => {
    const categories = await CategoryRepository.getCategories();
    return categories;
  },

  createCategory: async ({ name }) => {
    const normalizedName = name.trim();
    const existingCategory = await CategoryRepository.getCategoryByName(normalizedName);
    if (existingCategory) {
      throw createHttpError(409, "Category name already exists");
    }

    await CategoryRepository.createCategory(normalizedName);
  },

  updateCategoryById: async (categoryId, { name }) => {
    const normalizedName = name.trim();
    const requestedCategory = await CategoryRepository.getCategoryById(categoryId);
    if (!requestedCategory) {
      throw createHttpError(404, "Server could not find a requested category to update");
    }

    const existingCategory = await CategoryRepository.getCategoryByName(normalizedName);
    if (existingCategory && existingCategory.id !== Number(categoryId)) {
      throw createHttpError(409, "Category name already exists");
    }

    const rowCount = await CategoryRepository.updateCategoryById(categoryId, normalizedName);
    if (rowCount === 0) {
      throw createHttpError(404, "Server could not find a requested category to update");
    }
  },

  deleteCategoryById: async (categoryId) => {
    try {
      const rowCount = await CategoryRepository.deleteCategoryById(categoryId);
      if (rowCount === 0) {
        throw createHttpError(404, "Server could not find a requested category to delete");
      }
    } catch (error) {
      if (error?.code === "23503") {
        throw createHttpError(409, "Category is in use and cannot be deleted");
      }
      throw error;
    }
  },
};

export default CategoryService;
