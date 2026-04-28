import CommentRepository from "../repositories/comment.repository.mjs";
import ArticleRepository from "../repositories/article.repository.mjs";

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const isPublishedStatus = (status) => {
  const normalized = String(status ?? "").trim().toLowerCase();
  return normalized === "published" || normalized === "publish";
};

const CommentService = {
  getPublicCommentsForArticle: async (articleId) => {
    const article = await ArticleRepository.getArticleById(articleId, null);
    if (!article || !isPublishedStatus(article.status)) {
      throw createHttpError(404, "Server could not find a requested article");
    }
    return CommentRepository.listByPostId(Number(articleId));
  },

  createComment: async (articleId, userId, content) => {
    const article = await ArticleRepository.getArticleById(articleId, null);
    if (!article || !isPublishedStatus(article.status)) {
      throw createHttpError(404, "Server could not find a requested article");
    }
    const trimmed = String(content ?? "").trim();
    if (!trimmed) {
      throw createHttpError(400, "Comment cannot be empty");
    }
    return CommentRepository.create({
      postId: Number(articleId),
      userId,
      content: trimmed,
    });
  },
};

export default CommentService;
