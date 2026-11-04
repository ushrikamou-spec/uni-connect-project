// GridFS stores the uploaded files inside MongoDB itself, so the files and
// the data live together and everyone on Atlas later sees the same files.
import mongoose from "mongoose";

export function getMaterialsBucket() {
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database is not connected.");
    return new mongoose.mongo.GridFSBucket(db, { bucketName: "materials" });
}