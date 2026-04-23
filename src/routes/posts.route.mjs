import { Router } from "express";
import PostsMiddleware from "../middleware/posts.middleware.mjs";
import PostsController from "../controllers/posts.controller.mjs";

const postsRoute = Router();

postsRoute.get("/", PostsController.getPosts);

// GET /posts/:postId - Get a single post by ID
postsRoute.get(
  "/:postId",
  [PostsMiddleware.validatePostId],
  PostsController.getPostById
);

// POST /posts - Create a new post
postsRoute.post(
  "/",
  [PostsMiddleware.validatePostData],
  PostsController.createPost
);

// PUT /posts/:postId - Update a post
postsRoute.put(
  "/:postId",
  [PostsMiddleware.validatePostId, PostsMiddleware.validatePostData],
  PostsController.updatePostById
);

// DELETE /posts/:postId - Delete a post
postsRoute.delete(
  "/:postId",
  [PostsMiddleware.validatePostId],
  PostsController.deletePostById
);

export default postsRoute;
