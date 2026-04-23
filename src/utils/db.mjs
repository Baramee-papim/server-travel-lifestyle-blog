// Create PostgreSQL Connection Pool here !
import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

export default connectionPool;