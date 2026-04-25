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
};

export default AuthRepository;
