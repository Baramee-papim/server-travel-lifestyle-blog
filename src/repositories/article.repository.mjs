import connectionPool from "../utils/db.mjs";

const ArticleRepository = {
  getArticlesCount: async ({ whereClause, values }) => {
    const countQuery = `SELECT COUNT(*) as total FROM posts ${whereClause}`;
    const result = await connectionPool.query(countQuery, values);
    return parseInt(result.rows[0].total, 10);
  },

  getArticles: async ({ whereClause, values, limit, offset }) => {
    const dataQuery = `
      SELECT * FROM posts
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    const dataValues = [...values, limit, offset];
    const result = await connectionPool.query(dataQuery, dataValues);
    return result.rows;
  },

  getArticleById: async (articleId) => {
    const query = `SELECT * FROM posts WHERE id = $1`;
    const result = await connectionPool.query(query, [articleId]);
    return result.rows[0] || null;
  },

  createArticle: async (articleData) => {
    const query = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      articleData.title,
      articleData.image,
      articleData.category_id,
      articleData.description,
      articleData.content,
      articleData.status_id,
    ];
    await connectionPool.query(query, values);
  },

  updateArticleById: async (articleId, articleData) => {
    const query = `
      UPDATE posts
      SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6
      WHERE id = $7
    `;
    const values = [
      articleData.title,
      articleData.image,
      articleData.category_id,
      articleData.description,
      articleData.content,
      articleData.status_id,
      articleId,
    ];
    const result = await connectionPool.query(query, values);
    return result.rowCount;
  },

  deleteArticleById: async (articleId) => {
    const query = `DELETE FROM posts WHERE id = $1`;
    const result = await connectionPool.query(query, [articleId]);
    return result.rowCount;
  },
};

export default ArticleRepository;
