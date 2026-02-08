import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

const dbConnect = async (): Promise<typeof mongoose> => {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (!global.__mongooseConnectionPromise) {
    global.__mongooseConnectionPromise = mongoose.connect(mongodbUri);
  }

  return global.__mongooseConnectionPromise;
};

export default dbConnect;
