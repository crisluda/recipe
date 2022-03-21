import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    image: {
      type: String,
      required: [true, "Name is required"],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export { Category };
