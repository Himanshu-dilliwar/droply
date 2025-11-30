// src/lib/db.ts
import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

// Runtime check so TS knows this is a string (not string | undefined)
if (!mongodbUrl) {
  console.error("connectDb: MONGODB_URL is not defined. Add it to your .env.local");
  throw new Error("MONGODB_URL is not defined");
}

// Augment global to cache the connection between hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __mongoose__: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const cache = global.__mongoose__ ?? (global.__mongoose__ = { conn: null, promise: null });

const connectDb = async (): Promise<typeof mongoose> => {
  // If we already have a cached connection, use it
  if (cache.conn) {
    console.log("connectDb: using cached mongoose connection");
    return cache.conn;
  }

  // If no connection promise yet, start a new one
  if (!cache.promise) {
    console.log("connectDb: creating new mongoose connection");
    cache.promise = mongoose.connect(mongodbUrl).catch((err) => {
      console.error("connectDb: mongoose connection error:", err);
      cache.promise = null; // allow retry on next call
      throw err;
    });
  }

  // Wait for the connection promise to resolve
  cache.conn = await cache.promise;
  console.log("connectDb: mongoose connected, readyState:", mongoose.connection.readyState);
  return cache.conn;
};

export default connectDb;

// import mongoose from "mongoose";

// const mongodbUrl = process.env.MONGODB_URL;

// if (!mongodbUrl) {
//   console.error("❌ MONGODB_URL is missing in .env.local");
//   throw new Error("MONGODB_URL is missing");
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var __mongoose__: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   } | undefined;
// }

// const globalCache = global.__mongoose__ ?? (global.__mongoose__ = { conn: null, promise: null });

// export default async function connectDb() {
//   if (globalCache.conn) {
//     return globalCache.conn;
//   }

//   if (!globalCache.promise) {
//     globalCache.promise = mongoose.connect(mongodbUrl!, { serverSelectionTimeoutMS: 5000 })

//       .then((mongooseInstance) => {
//         return mongooseInstance;
//       })
//       .catch((err) => {
//         globalCache.promise = null;
//         throw err;
//       });
//   }

//   globalCache.conn = await globalCache.promise;
//   return globalCache.conn;
// }
