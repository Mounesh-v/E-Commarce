import multer from "multer";

const maxImageBytes = Number(process.env.UPLOAD_IMAGE_MAX_BYTES || 2 * 1024 * 1024);

const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype?.startsWith("image/")) {
    return cb(new Error("Only image uploads are allowed"));
  }

  return cb(null, true);
};

const memoryStorage = multer.memoryStorage();

export const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: maxImageBytes,
    files: 1,
  },
  fileFilter: imageFileFilter,
});

const diskStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: maxImageBytes,
    files: 1,
  },
  fileFilter: imageFileFilter,
});
