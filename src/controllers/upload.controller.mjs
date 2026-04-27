import UploadService from "../services/upload.service.mjs";

const handleControllerError = (res, error, fallbackMessage) => {
  console.error(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    message: error.status ? error.message : fallbackMessage,
    error: error.message,
  });
};

const UploadController = {
  uploadArticleImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      const imageUrl = await UploadService.uploadArticleImage(req.file);
      return res.status(201).json({ imageUrl });
    } catch (error) {
      return handleControllerError(
        res,
        error,
        "Server could not upload image because storage connection",
      );
    }
  },
};

export default UploadController;
