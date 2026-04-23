import PostsRepository from "../repositories/posts.repository.mjs";

const toPositiveInt = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return defaultValue;
  }

  return parsed;
};

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const PostsService = {
  getPosts: async ({ page, limit, category, keyword }) => {
    const currentPage = toPositiveInt(page, 1);
    const currentLimit = toPositiveInt(limit, 6);
    const offset = (currentPage - 1) * currentLimit;

    const conditions = [];
    const values = [];

    if (category) {
      conditions.push(`category_id = $${values.length + 1}`);
      values.push(category);
    }

    if (keyword) {
      conditions.push(`(
        title ILIKE $${values.length + 1} OR
        description ILIKE $${values.length + 1} OR
        content ILIKE $${values.length + 1}
      )`);
      values.push(`%${keyword}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [totalPosts, posts] = await Promise.all([
      PostsRepository.getPostsCount({ whereClause, values }),
      PostsRepository.getPosts({ whereClause, values, limit: currentLimit, offset }),
    ]);

    const totalPages = Math.ceil(totalPosts / currentLimit);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      totalPosts,
      totalPages,
      currentPage,
      limit: currentLimit,
      posts,
      nextPage,
    };
  },

  getPostById: async (postId) => {
    const post = await PostsRepository.getPostById(postId);
    if (!post) {
      throw createHttpError(404, "Server could not find a requested post");
    }

    return post;
  },

  createPost: async (postData) => {
    await PostsRepository.createPost(postData);
  },

  updatePostById: async (postId, postData) => {
    const rowCount = await PostsRepository.updatePostById(postId, postData);
    if (rowCount === 0) {
      throw createHttpError(404, "Server could not find a requested post to update");
    }
  },

  deletePostById: async (postId) => {
    const rowCount = await PostsRepository.deletePostById(postId);
    if (rowCount === 0) {
      throw createHttpError(404, "Server could not find a requested post to delete");
    }
  },
};

export default PostsService;
