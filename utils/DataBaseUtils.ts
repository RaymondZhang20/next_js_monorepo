import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(isConnected) {
    console.log('MongoDB is already connected');
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "bill_splitter",
    })

    isConnected = true;

    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
  }
}