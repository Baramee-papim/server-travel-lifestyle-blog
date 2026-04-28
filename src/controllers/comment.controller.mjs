import CommentService from "../services/comment.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const CommentController = {
  listForArticle: async (req, res) => {
    try {
      const comments = await CommentService.getPublicCommentsForArticle(req.params.articleId);
      return res.status(200).json({ data: comments });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not load comments",
      );
    }
  },

  create: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized", error: "Unauthorized" });
      }
      const comment = await CommentService.createComment(
        req.params.articleId,
        userId,
        req.body.content,
      );
      return res.status(201).json({ data: comment });
    } catch (error) {
      return handleControllerError(res, error, "Server could not save comment");
    }
  },
};

export default CommentController;
