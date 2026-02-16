import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// GET /posts - Get all posts with pagination, filtering, and search
router.get("/", async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const category = req.query.category;
        const keyword = req.query.keyword;
        
        // Calculate offset for pagination
        const offset = (page - 1) * limit;
        
        // Build WHERE clause conditions
        const conditions = [];
        const values = [];
        let paramIndex = 1;
        
        // Filter by category
        if (category) {
            conditions.push(`category_id = $${paramIndex}`);
            values.push(category);
            paramIndex++;
        }
        
        // Search by keyword (title, description, or content)
        if (keyword) {
            conditions.push(`(
                title ILIKE $${paramIndex} OR 
                description ILIKE $${paramIndex} OR 
                content ILIKE $${paramIndex}
            )`);
            values.push(`%${keyword}%`);
            paramIndex++;
        }
        
        // Build WHERE clause
        const whereClause = conditions.length > 0 
            ? `WHERE ${conditions.join(' AND ')}` 
            : '';
        
        // Query to get total count
        const countQuery = `SELECT COUNT(*) as total FROM posts ${whereClause}`;
        const countResult = await connectionPool.query(countQuery, values);
        const totalPosts = parseInt(countResult.rows[0].total);
        
        // Query to get posts with pagination
        const dataQuery = `
            SELECT * FROM posts 
            ${whereClause}
            ORDER BY id DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const dataValues = [...values, limit, offset];
        const dataResult = await connectionPool.query(dataQuery, dataValues);
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalPosts / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        
        return res.status(200).json({
            totalPosts,
            totalPages,
            currentPage: page,
            limit,
            posts: dataResult.rows,
            nextPage
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Server could not read post because database connection", 
            error: error.message 
        });
    }
});

// GET /posts/:postId - Get a single post by ID
router.get("/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const query = `SELECT * FROM posts WHERE id = $1`;
        const result = await connectionPool.query(query, [postId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Server could not find a requested post" });
        }
        
        return res.status(200).json({ data: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Server could not read post because database connection", 
            error: error.message 
        });
    }
});

// POST /posts - Create a new post
router.post("/", async (req, res) => {
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

        // Return ตัว Response กลับไปหา Client ว่าสร้างสำเร็จ
        return res.status(201).json({ message: "Created post successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: `Server could not create post because database connection`,
            error: error.message,
        });
    }
});

// PUT /posts/:postId - Update a post
router.put("/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const updatedPost = req.body;
        
        // Check if post exists
        const checkQuery = `SELECT id FROM posts WHERE id = $1`;
        const checkResult = await connectionPool.query(checkQuery, [postId]);
        
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: "Server could not find a requested post to update" });
        }
        
        const query = `UPDATE posts SET title = $1, image = $2, category_id = $3, description = $4, content = $5, status_id = $6 WHERE id = $7`;
        const values = [
            updatedPost.title, 
            updatedPost.image, 
            updatedPost.category_id, 
            updatedPost.description, 
            updatedPost.content, 
            updatedPost.status_id, 
            postId
        ];
        
        const result = await connectionPool.query(query, values);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Server could not find a requested post to update" });
        }
        
        return res.status(200).json({ message: "Updated post successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Server could not update post because database connection", 
            error: error.message 
        });
    }
});

// DELETE /posts/:postId - Delete a post
router.delete("/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const query = `DELETE FROM posts WHERE id = $1`;
        const result = await connectionPool.query(query, [postId]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Server could not find a requested post to delete" });
        }
        
        return res.status(200).json({ message: "Deleted post successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: "Server could not delete post because database connection", 
            error: error.message 
        });
    }
});

export default router;
