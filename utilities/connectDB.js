import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://arjunkb:arjun123@cluster0.ubir938.mongodb.net/arjunprod?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB is connected!")
  } catch (err) {
    console.log("MONGODB CONNECTION ERROR", err);
  }
};

export default connectDB;