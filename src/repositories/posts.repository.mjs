import connectionPool from "../utils/db.mjs";

const PostsRepository = {
  getPostsCount: async ({ whereClause, values }) => {
    const countQuery = `SELECT COUNT(*) as total FROM posts ${whereClause}`;
    const result = await connectionPool.query(countQuery, values);
    return parseInt(result.rows[0].total, 10);
  },

  getPosts: async ({ whereClause, values, limit, offset }) => {
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

  getPostById: async (postId) => {
    const query = `SELECT * FROM posts WHERE id = $1`;
    const result = await connectionPool.query(query, [postId]);
    return result.rows[0] || null;
  },

  createPost: async (postData) => {
    const query = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      postData.title,
      postData.image,
      postData.category_id,
      postData.description,
      postData.content,
      postData.status_id,
    ];
    await connectionPool.query(query, values);
  },

  updatePostById: async (postId, postData) => {
    const query = `
      UPDATE posts
      SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6
      WHERE id = $7
    `;
    const values = [
      postData.title,
      postData.image,
      postData.category_id,
      postData.description,
      postData.content,
      postData.status_id,
      postId,
    ];
    const result = await connectionPool.query(query, values);
    return result.rowCount;
  },

  deletePostById: async (postId) => {
    const query = `DELETE FROM posts WHERE id = $1`;
    const result = await connectionPool.query(query, [postId]);
    return result.rowCount;
  },
};

export default PostsRepository;
