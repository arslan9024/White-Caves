import mongoose from 'mongoose';
import Contract from '../models/Contract.js';
import SignatureToken from '../models/SignatureToken.js';

const getOrCreateModel = name => {
  if (mongoose.models[name]) {
    return mongoose.models[name];
  }

  const schema = new mongoose.Schema({}, { strict: false, timestamps: true });
  return mongoose.model(name, schema);
};

let connectionPromise = null;

export async function connectDB(
  uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/white-caves'
) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  }).then(() => mongoose.connection).catch(err => {
    connectionPromise = null;
    throw err;
  });

  return connectionPromise;
}

export { Contract, SignatureToken };

// Backward-compatible exports used by legacy services/routes.
export const WhatsAppMessage = getOrCreateModel('WhatsAppMessage');
export const WhatsAppChatbotRule = getOrCreateModel('WhatsAppChatbotRule');
export const WhatsAppSettings = getOrCreateModel('WhatsAppSettings');
export const WhatsAppContact = getOrCreateModel('WhatsAppContact');
