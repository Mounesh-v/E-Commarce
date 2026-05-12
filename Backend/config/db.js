import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 5),
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error.message);
    throw error;
  }
};

export default connectDb;
