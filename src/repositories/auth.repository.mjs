import connectionPool from "../utils/db.mjs";

const AuthRepository = {
  getUserByUsername: async (username) => {
    const query = `
      SELECT * FROM users
      WHERE username = $1
    `;
    const result = await connectionPool.query(query, [username]);
    return result.rows[0] || null;
  },

  createUser: async ({ id, username, name, role }) => {
    const query = `
      INSERT INTO users (id, username, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id, username, name, role];
    const result = await connectionPool.query(query, values);
    return result.rows[0];
  },

  getUserById: async (id) => {
    const query = `
      SELECT * FROM users
      WHERE id = $1
    `;
    const result = await connectionPool.query(query, [id]);
    return result.rows[0] || null;
  },

  getUserByUsernameExcludingId: async (username, excludedUserId) => {
    const query = `
      SELECT * FROM users
      WHERE username = $1
        AND id <> $2
    `;
    const result = await connectionPool.query(query, [username, excludedUserId]);
    return result.rows[0] || null;
  },

  updateUserProfile: async ({ id, name, username, bio, profilePic }) => {
    const query = `
      UPDATE users
      SET
        name = $2,
        username = $3,
        bio = $4,
        profile_pic = $5
      WHERE id = $1
      RETURNING *
    `;
    const values = [id, name, username, bio, profilePic];
    const result = await connectionPool.query(query, values);
    return result.rows[0] || null;
  },
};

export default AuthRepository;
