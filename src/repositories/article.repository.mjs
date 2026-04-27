import connectionPool from "../utils/db.mjs";

const postsFromWithJoins = `
  FROM posts p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN statuses s ON p.status_id = s.id
`;

const postsColumnsBase = `
  p.id,
  p.image,
  p.title,
  p.description,
  p.date,
  p.content,
  p.likes_count
`;

const postsSelectWithJoins = `
  SELECT
    ${postsColumnsBase},
    c.name AS category,
    s.status AS status
  ${postsFromWithJoins}
`;

const ArticleRepository = {
  getArticlesCount: async ({ whereClause, values }) => {
    const countQuery = `SELECT COUNT(*) as total ${postsFromWithJoins} ${whereClause}`;
    const result = await connectionPool.query(countQuery, values);
    return parseInt(result.rows[0].total, 10);
  },

  getArticles: async ({ whereClause, values, limit, offset }) => {
    const dataQuery = `
      ${postsSelectWithJoins}
      ${whereClause}
      ORDER BY p.id DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    const dataValues = [...values, limit, offset];
    const result = await connectionPool.query(dataQuery, dataValues);
    return result.rows;
  },

  getArticleById: async (articleId) => {
    const query = `
      ${postsSelectWithJoins}
      WHERE p.id = $1
    `;
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

  getStatusIdByName: async (statusName) => {
    const query = `
      SELECT id
      FROM statuses
      WHERE LOWER(status) = LOWER($1)
      LIMIT 1
    `;
    const result = await connectionPool.query(query, [statusName]);
    return result.rows[0]?.id || null;
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
