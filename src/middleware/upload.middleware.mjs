import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only jpeg, png, or webp images are allowed"));
      return;
    }
    cb(null, true);
  },
});

const UploadMiddleware = {
  uploadArticleImage: upload.single("file"),
  handleUploadError: (error, req, res, next) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image size must not exceed 5MB" });
      }
      return res.status(400).json({ message: error.message });
    }

    return res.status(400).json({ message: error.message || "Invalid upload file" });
  },
};

export default UploadMiddleware;
