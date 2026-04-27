import supabaseAdmin from "../utils/supabase-admin.mjs";

const ARTICLE_BUCKET_NAME = "article-img";
const PROFILE_BUCKET_NAME = "profile-img";

const buildFilePath = (prefix, fileName) => {
  const safeName = fileName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
  return `${prefix}/${Date.now()}-${safeName}`;
};

const uploadImageToBucket = async (bucketName, pathPrefix, file, fallbackFileName) => {
  const filePath = buildFilePath(pathPrefix, file.originalname || fallbackFileName);
  const { error } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

const UploadService = {
  uploadArticleImage: async (file) => {
    return uploadImageToBucket(
      ARTICLE_BUCKET_NAME,
      "articles",
      file,
      "article-image",
    );
  },

  uploadProfileImage: async (file) => {
    return uploadImageToBucket(
      PROFILE_BUCKET_NAME,
      "profiles",
      file,
      "profile-image",
    );
  },
};

export default UploadService;
