import dns from 'node:dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '1.1.1.1']);

// Serverless environment mein connection cache karna zaroori hai,
// warna har request pr naya connection banega aur MongoDB limit khatam ho jayegi
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('MongoDB connected');
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}