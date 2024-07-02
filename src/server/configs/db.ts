import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionURI = process.env.MONGO_URI as string;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const connection = await mongoose.connect(connectionURI);
    console.log(
      `app is connect to mongo db database on : ${connection.connection.host}`
    );
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
