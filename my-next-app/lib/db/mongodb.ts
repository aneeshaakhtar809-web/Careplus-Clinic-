import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clinic_appointment_db';

/**
 * Global cache for Mongoose connection in Next.js development.
 * Prevents multiple connections during Fast Refresh / HMR.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5s timeout instead of hanging
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ [MongoDB] Successfully connected to database');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ [MongoDB] Connection error:', err.message);
      cached.promise = null;
      throw new Error(`Failed to connect to MongoDB at "${MONGODB_URI}". Please verify that MongoDB is running locally or provide a valid MONGODB_URI in your .env.local file.`);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export default connectToDatabase;
