const CommentMiddleware = {
  validateCreateComment: (req, res, next) => {
    const { content } = req.body ?? {};
    if (content == null || typeof content !== "string") {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }
    if (content.trim().length === 0) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }
    return next();
  },
};

export default CommentMiddleware;
