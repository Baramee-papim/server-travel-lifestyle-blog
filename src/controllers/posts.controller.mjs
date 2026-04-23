import PostsService from "../services/posts.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const PostsController = {
  getPosts: async (req, res) => {
    try {
      const postsResult = await PostsService.getPosts(req.query);
      return res.status(200).json(postsResult);
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read post because database connection"
      );
    }
  },

  getPostById: async (req, res) => {
    try {
      const post = await PostsService.getPostById(req.params.postId);
      return res.status(200).json({ data: post });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not read post because database connection"
      );
    }
  },

  createPost: async (req, res) => {
    try {
      await PostsService.createPost(req.body);
      return res.status(201).json({ message: "Created post successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not create post because database connection"
      );
    }
  },

  updatePostById: async (req, res) => {
    try {
      await PostsService.updatePostById(req.params.postId, req.body);
      return res.status(200).json({ message: "Updated post successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not update post because database connection"
      );
    }
  },

  deletePostById: async (req, res) => {
    try {
      await PostsService.deletePostById(req.params.postId);
      return res.status(200).json({ message: "Deleted post successfully" });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not delete post because database connection"
      );
    }
  },
};

export default PostsController;
