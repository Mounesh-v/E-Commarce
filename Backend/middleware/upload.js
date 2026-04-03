// middleware/upload.js

import multer from "multer";

/* 🔹 MEMORY STORAGE (for AI / image search) */
const memoryStorage = multer.memoryStorage();

export const uploadMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* 🔹 DISK STORAGE (for product images / cloud upload) */
const diskStorage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadDisk = multer({ storage: diskStorage });