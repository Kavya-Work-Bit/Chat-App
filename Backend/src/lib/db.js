import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongodb");
  } catch (err) {
    console.log("connection has been failed to mongodb", err);
  }
};

export default connectToMongo;
