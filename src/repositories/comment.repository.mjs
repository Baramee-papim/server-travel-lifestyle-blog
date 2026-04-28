import connectionPool from "../utils/db.mjs";

const CommentRepository = {
  listByPostId: async (postId) => {
    const query = `
      SELECT
        c.id,
        c.comment_text AS content,
        c.created_at,
        u.name AS author_name,
        u.username AS author_username,
        u.profile_pic AS author_avatar
      FROM comments c
      INNER JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `;
    const result = await connectionPool.query(query, [postId]);
    return result.rows;
  },

  create: async ({ postId, userId, content }) => {
    const query = `
      INSERT INTO comments (post_id, user_id, comment_text)
      VALUES ($1, $2::uuid, $3)
      RETURNING id, comment_text, created_at
    `;
    const insertResult = await connectionPool.query(query, [postId, userId, content.trim()]);
    const row = insertResult.rows[0];
    const userResult = await connectionPool.query(
      `SELECT name, username, profile_pic FROM users WHERE id = $1::uuid`,
      [userId],
    );
    const u = userResult.rows[0] || {};
    return {
      id: row.id,
      content: row.comment_text,
      created_at: row.created_at,
      author_name: u.name,
      author_username: u.username,
      author_avatar: u.profile_pic,
    };
  },
};

export default CommentRepository;
