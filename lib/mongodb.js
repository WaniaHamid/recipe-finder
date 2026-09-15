import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and warm invocations in serverless environments.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel Environment Variables');
  }

  // Clean URI to prevent accidental quotes or trailing whitespace from copy-pasting
  const uri = rawUri.trim().replace(/^["']|["']$/g, '');

  // Check if existing connection is still alive (1 = connected)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise || mongoose.connection.readyState === 0) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    // Safe host extraction for logging (never exposes username, password or query params)
    const hostMatch = uri.match(/@([^/?]+)/);
    const host = hostMatch ? hostMatch[1] : 'cluster';

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`✅ Connected to MongoDB (${host})`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('❌ MongoDB connection error:', e.name, e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;