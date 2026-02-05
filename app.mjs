import express from "express";
import "dotenv/config";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4000;



app.use(express.json());
app.get("/health", (req, res) => {
    res.status(200).json({ message: "OK" });
  });

app.post("/posts", async (req, res) => {

    try {
  const newPost = req.body;

  if (!newPost.title || !newPost.image || !newPost.category_id || !newPost.description || !newPost.content || !newPost.status_id) {
    return res.status(400).json({ message: "Server could not create post because there are missing data from client" });
  }
  
    
    const query = `insert into posts (title, image, category_id, description, content, status_id)
    values ($1, $2, $3, $4, $5, $6)`;

    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];

    await connectionPool.query(query, values);
  } catch(error) {
    console.error(error);
    return res.status(500).json({
      message: `Server could not create post because database connection`,
      error: error.message,
    });
  }

  // 3) Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ
  return res.status(201).json({ message: "Created post successfully" });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});