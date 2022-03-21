import express from "express";
import {
  homePage,
  exploreCategories,
  exploreRecipe,
  exploreCategoriesById,
  searchRecipe,
  searchPage,
  exploreLatest,
  exploreRandom,
  submitRecipe,
  submitRecipeOnPost,
  updateRecipe,
  updateRecipePut,
  deleteRecipe,
} from "../controllers/recipeController.mjs";

const router = express.Router();

router.get("/", homePage);
router.get("/categories", exploreCategories);
router.get("/categories/:id", exploreCategoriesById);
router.get("/recipe/:id", exploreRecipe);
router.post("/search", searchRecipe);
router.get("/search", searchPage);
router.get("/explore-latest", exploreLatest);
router.get("/explore-random", exploreRandom);
router.get("/submit-recipe", submitRecipe);
router.post("/submit-recipe", submitRecipeOnPost);
router.get("/update-recipe/:id", updateRecipe);
router.put("/update-recipe/:id", updateRecipePut);
router.delete("/delete/:id", deleteRecipe);

export default router;
