import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_IMAGE_MODEL = "Xenova/clip-vit-base-patch32";
const MODEL_TASK = "image-feature-extraction";
const MAX_CONCURRENT_INFERENCE = Number(process.env.AI_MAX_CONCURRENT_INFERENCE || 1);
const TMP_DIR = process.env.AI_TMP_DIR || os.tmpdir();

let extractor = null;
let extractorPromise = null;
let activeInference = 0;
const inferenceQueue = [];

const mb = (bytes) => Math.round((bytes / 1024 / 1024) * 10) / 10;

export const logMemoryUsage = (label = "memory") => {
  const usage = process.memoryUsage();
  console.log(
    `[${label}] rss=${mb(usage.rss)}Mi heapUsed=${mb(usage.heapUsed)}Mi heapTotal=${mb(
      usage.heapTotal,
    )}Mi external=${mb(usage.external)}Mi arrayBuffers=${mb(usage.arrayBuffers)}Mi`,
  );
};

const configureTransformers = (env) => {
  env.allowRemoteModels = process.env.TRANSFORMERS_ALLOW_REMOTE !== "false";
  env.allowLocalModels = process.env.TRANSFORMERS_ALLOW_LOCAL === "true";
  env.cacheDir = process.env.TRANSFORMERS_CACHE || path.join(os.tmpdir(), "transformers-cache");

  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = Number(process.env.ORT_NUM_THREADS || 1);
    env.backends.onnx.wasm.simd = process.env.ORT_WASM_SIMD !== "false";
  }
};

export const getImageEmbeddingExtractor = async () => {
  if (extractor) return extractor;

  if (!extractorPromise) {
    extractorPromise = (async () => {
      logMemoryUsage("before-model-load");
      const { env, pipeline } = await import("@xenova/transformers");
      configureTransformers(env);

      const model = process.env.IMAGE_EMBEDDING_MODEL || DEFAULT_IMAGE_MODEL;
      const instance = await pipeline(MODEL_TASK, model, {
        quantized: process.env.AI_QUANTIZED !== "false",
        progress_callback: process.env.AI_MODEL_PROGRESS === "true" ? console.log : undefined,
      });

      extractor = instance;
      logMemoryUsage("after-model-load");
      console.log(`[ai] image embedding model ready: ${model}`);
      return instance;
    })().catch((error) => {
      extractorPromise = null;
      extractor = null;
      throw error;
    });
  }

  return extractorPromise;
};

const acquireInferenceSlot = async () => {
  if (activeInference < MAX_CONCURRENT_INFERENCE) {
    activeInference += 1;
    return;
  }

  await new Promise((resolve) => inferenceQueue.push(resolve));
  activeInference += 1;
};

const releaseInferenceSlot = () => {
  activeInference = Math.max(0, activeInference - 1);
  const next = inferenceQueue.shift();
  if (next) next();
};

export const normalizeVector = (vector) => {
  if (!Array.isArray(vector) || vector.length === 0) return [];
  let magnitude = 0;
  for (const value of vector) magnitude += value * value;
  magnitude = Math.sqrt(magnitude);
  if (!magnitude) return vector;
  return vector.map((value) => value / magnitude);
};

export const getImageEmbeddingFromBuffer = async (buffer) => {
  if (!buffer?.length) {
    throw new Error("Image buffer is empty");
  }

  await acquireInferenceSlot();

  const tempPath = path.join(
    TMP_DIR,
    `product-image-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
  );

  try {
    const model = await getImageEmbeddingExtractor();
    await fs.writeFile(tempPath, buffer);

    logMemoryUsage("before-embedding");
    const output = await model(tempPath, {
      pooling: process.env.AI_POOLING || "mean",
      normalize: true,
    });

    const raw = output?.[0]?.data || output?.data;
    if (!raw) throw new Error("Embedding model returned no vector data");

    const embedding = normalizeVector(Array.from(raw).flat());
    logMemoryUsage("after-embedding");
    return embedding;
  } finally {
    releaseInferenceSlot();
    await fs.rm(tempPath, { force: true }).catch(() => {});
  }
};

export const disposeTransformerModel = async () => {
  const current = extractor;
  extractor = null;
  extractorPromise = null;

  if (current?.dispose) {
    await current.dispose();
  }

  inferenceQueue.splice(0).forEach((resolve) => resolve());
  logMemoryUsage("after-model-dispose");
};
