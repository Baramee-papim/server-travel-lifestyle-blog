import connectionPool from "../utils/db.mjs";

const CategoryRepository = {
  getCategories: async () => {
    const query = `
      SELECT id, name
      FROM categories
      ORDER BY id ASC
    `;
    const result = await connectionPool.query(query);
    return result.rows;
  },

  getCategoryById: async (categoryId) => {
    const query = `
      SELECT id, name
      FROM categories
      WHERE id = $1
      LIMIT 1
    `;
    const result = await connectionPool.query(query, [categoryId]);
    return result.rows[0];
  },

  getCategoryByName: async (categoryName) => {
    const query = `
      SELECT id, name
      FROM categories
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1
    `;
    const result = await connectionPool.query(query, [categoryName]);
    return result.rows[0];
  },

  createCategory: async (categoryName) => {
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
    `;
    await connectionPool.query(query, [categoryName]);
  },

  updateCategoryById: async (categoryId, categoryName) => {
    const query = `
      UPDATE categories
      SET name = $1
      WHERE id = $2
    `;
    const result = await connectionPool.query(query, [categoryName, categoryId]);
    return result.rowCount;
  },

  deleteCategoryById: async (categoryId) => {
    const query = `
      DELETE FROM categories
      WHERE id = $1
    `;
    const result = await connectionPool.query(query, [categoryId]);
    return result.rowCount;
  },
};

export default CategoryRepository;
