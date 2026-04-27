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
};

export default CategoryRepository;
