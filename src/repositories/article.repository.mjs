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

  /**
   * @param {string | null} [viewerUserId] - When set, `liked_by_me` reflects likes row for this user.
   */
  getArticleById: async (articleId, viewerUserId = null) => {
    const query = `
      SELECT
        ${postsColumnsBase},
        c.name AS category,
        s.status AS status,
        ($2::uuid IS NOT NULL AND EXISTS (
          SELECT 1 FROM likes l
          WHERE l.post_id = p.id AND l.user_id = $2::uuid
        )) AS liked_by_me
      ${postsFromWithJoins}
      WHERE p.id = $1
    `;
    const result = await connectionPool.query(query, [articleId, viewerUserId]);
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

  /**
   * Inserts into `likes` (post_id, user_id). Requires UNIQUE (post_id, user_id) for ON CONFLICT.
   * Increments posts.likes_count only when a new row is inserted.
   * @returns {{ likesCount: number, inserted: boolean }}
   */
  addPostLike: async (postId, userId) => {
    const client = await connectionPool.connect();
    try {
      await client.query("BEGIN");
      const insertResult = await client.query(
        `INSERT INTO likes (post_id, user_id, liked_at)
         VALUES ($1, $2::uuid, now())
         ON CONFLICT (post_id, user_id) DO NOTHING
         RETURNING id`,
        [postId, userId],
      );
      const inserted = insertResult.rowCount > 0;
      let likesCount;
      if (inserted) {
        const updateResult = await client.query(
          `UPDATE posts
           SET likes_count = COALESCE(likes_count, 0) + 1
           WHERE id = $1
           RETURNING likes_count`,
          [postId],
        );
        likesCount = updateResult.rows[0]?.likes_count ?? 0;
      } else {
        const sel = await client.query(`SELECT likes_count FROM posts WHERE id = $1`, [postId]);
        likesCount = sel.rows[0]?.likes_count ?? 0;
      }
      await client.query("COMMIT");
      return { likesCount, inserted };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};

export default ArticleRepository;
