import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: " Please provide a recipe name.",
    },

    description: {
      type: String,
      required: [true, "Please provide a description."],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
    },
    ingredients: {
      type: Array,
      required: [true, "Please provide a ingredients"],
    },
    category: {
      type: String,
      required: [true, "Please choose a recipe."],
      enum: ["Thai", "American", "Chinese", "Mexican", "Indian"],
    },
    image: {
      type: String,
      required: [true, "Please upload an image."],
    },
  },
  { timestamps: true }
);

recipeSchema.index({
  name: "text",
  ingredients: "array",
  category: "text",
  description: "text",
});
// recipeSchema.index({ "$***": "text" });

const Recipe = mongoose.model("Recipe", recipeSchema);
export { Recipe };
