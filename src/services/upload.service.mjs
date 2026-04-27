import supabaseAdmin from "../utils/supabase-admin.mjs";

const bucketName = "article-img";

const buildFilePath = (fileName) => {
  const safeName = fileName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
  return `articles/${Date.now()}-${safeName}`;
};

const UploadService = {
  uploadArticleImage: async (file) => {
    const filePath = buildFilePath(file.originalname || "article-image");
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
  },
};

export default UploadService;
