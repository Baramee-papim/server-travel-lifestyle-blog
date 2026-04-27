import CategoryRepository from "../repositories/category.repository.mjs";

const CategoryService = {
  getCategories: async () => {
    const categories = await CategoryRepository.getCategories();
    return categories;
  },
};

export default CategoryService;
