import mongoose from 'mongoose';

/**
 * Initialize MongoDB connection using Mongoose.
 * Reads connection string from env `MONGO_URI`.
 * Returns the `mongoose.Connection` instance.
 */
export async function initMongo(): Promise<mongoose.Connection> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not set');
  }
  await mongoose.connect(uri, {
    // useNewUrlParser & useUnifiedTopology are true by default in Mongoose 7
  });
  return mongoose.connection;
}

/** Close the MongoDB connection gracefully */
export async function closeMongo(): Promise<void> {
  await mongoose.disconnect();
}
