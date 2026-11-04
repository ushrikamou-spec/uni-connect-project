import mongoose from "mongoose";

// Reuse one connection across hot reloads in development and across
// requests in production, instead of opening a new one every time.
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
    global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set. Add it to .env.local and restart.");
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // allow a retry on the next request
        throw error;
    }

    return cached.conn;
}