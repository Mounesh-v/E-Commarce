// router/ai.routes.js

import express from "express";
import { uploadMemory } from "../middleware/upload.js";
import { searchByImage } from "../controller/ai.controller.js";

const router = express.Router();
router.post("/image-search", uploadMemory.single("image"), searchByImage);

export default router;
