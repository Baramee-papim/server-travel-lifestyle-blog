const isMissing = (value) => value === undefined || value === null;

const ArticleMiddleware = {
  validateArticleId: (req, res, next) => {
    const articleId = Number(req.params.articleId);
    if (!Number.isInteger(articleId) || articleId < 1) {
      return res.status(400).json({
        message: "Article ID must be a positive integer",
      });
    }

    return next();
  },

  validateArticleData: (req, res, next) => {
    const data = req.body;
    const errors = [];

    if (isMissing(data.title)) {
      errors.push("Title is required");
    } else if (typeof data.title !== "string") {
      errors.push("Title must be a string");
    }

    if (isMissing(data.image)) {
      errors.push("Image is required");
    } else if (typeof data.image !== "string") {
      errors.push("Image must be a string");
    }

    if (isMissing(data.category_id)) {
      errors.push("Category ID is required");
    } else if (typeof data.category_id !== "number") {
      errors.push("Category ID must be a number");
    }

    if (isMissing(data.description)) {
      errors.push("Description is required");
    } else if (typeof data.description !== "string") {
      errors.push("Description must be a string");
    }

    if (isMissing(data.content)) {
      errors.push("Content is required");
    } else if (typeof data.content !== "string") {
      errors.push("Content must be a string");
    }

    if (isMissing(data.status_id)) {
      errors.push("Status ID is required");
    } else if (typeof data.status_id !== "number") {
      errors.push("Status ID must be a number");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors[0],
        errors,
      });
    }

    return next();
  },
};

export default ArticleMiddleware;
