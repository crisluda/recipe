import mongoose from "mongoose";

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`connected`);
  } catch (error) {
    console.log(`connection error`);
  }
};
export { conn };
