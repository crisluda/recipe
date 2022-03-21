import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Category } from "../models/Category.mjs";
import { Recipe } from "../models/Recipe.mjs";
/**
 *GET
 * homepage
 * /
 **/
const homePage = async (req, res) => {
  try {
    let categories = await Category.find().limit(5);
    const latest = await Recipe.find().sort({ createdAt: -1 });
    const thai = await Recipe.find({ category: "Thai" }).limit(5);
    const american = await Recipe.find({ category: "American" })
      .limit(5)
      .lean();
    const chainese = await Recipe.find({ category: "Chines" }).limit(5);
    const indian = await Recipe.find({ category: "Indian" }).limit(5);
    const mexican = await Recipe.find({ category: "Mexican" }).limit(5);

    const food = {
      latest,
      thai,
      american,
      chainese,
      indian,
      mexican,
    };
    res.status(200).render("index", { title: "Home Page", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *GET /categories
 * categories
 * /
 **/
const exploreCategories = async (req, res) => {
  try {
    let categories = await Category.find().limit(20);
    res
      .status(200)
      .render("categories", { title: "Cooking Blog - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *GET /categories/id
 * categories by id
 * /
 **/
const exploreCategoriesById = async (req, res) => {
  let categoryId = req.params.id;
  try {
    let categoriesById = await Recipe.find({ category: categoryId }).limit(20);
    res.status(200).render("categories", {
      title: "Cooking Blog - Categories",
      categoriesById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *GET /recipe/:id
 * Recipe
 * /
 **/
const exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    let recipe = await Recipe.findById(recipeId);
    res
      .status(200)
      .render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};
/**
 *POST /search
 * Search
 * /
 **/
const searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    let noRecipe = await Recipe.find().limit(15);
    res
      .status(200)
      .render("search", { title: "Cooking Blog - Search", recipe, noRecipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *POST /search
 * Search
 * /
 **/
const searchPage = async (req, res) => {
  try {
    let recipe = await Recipe.find({});
    res
      .status(200)
      .render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *GET /explore Latest
 * explore Latest
 * /
 **/
const exploreLatest = async (req, res) => {
  try {
    let recipe = await Recipe.find({}).sort({ createdAt: 1 }).limit(21);
    res
      .status(200)
      .render("explore-latest", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *GET /explore Random
 * explore Random
 * /
 **/
const exploreRandom = async (req, res) => {
  try {
    let recipe = await Recipe.find({}).sort({ createdAt: -1 }).limit(15);
    res
      .status(200)
      .render("explore-random", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};
/**
 *GET /Submit
 * Submit
 * /
 **/
const submitRecipe = async (req, res) => {
  try {
    let infoErrorObj = req.flash("infoErrors");
    let infoSubmitObj = req.flash("infoSubmit");
    let imageSizeObj = req.flash("infoImageSize");
    let recipe = await Recipe.find({}).sort({ createdAt: -1 }).limit(15);
    res.status(200).render("submit-recipe", {
      title: "Cooking Blog - Submit Recipe",
      recipe,
      infoErrorObj,
      infoSubmitObj,
      imageSizeObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *GET /Submit
 * Submit
 * /
 **/
const submitRecipeOnPost = async (req, res) => {
  try {
    let newImageName;
    if (!req.files) {
      req.flash(
        "infoImageSize",
        "Please upload an image with size greater then 1mb"
      );
    } else {
      let imageUploadFile = req.files.image;
      let imageExtension = imageUploadFile.name.split(".")[1];
      newImageName = uuidv4().split("-")[0] + "." + imageExtension;
      let uploadPath = path.resolve("./") + "/public/uploads/" + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          console.log("file uploaded");
        }
      });
    }

    const { name, description, email, ingredients, category, image } = req.body;
    const newRecipe = await Recipe({
      name,
      description,
      email,
      ingredients,
      category,
      image: newImageName,
    });
    await newRecipe.save();
    req.flash("infoSubmit", "Recipe has been added");
    res.status(301).redirect("/submit-recipe");
  } catch (error) {
    // req.flash("infoErrors", error.errors);
    // res.status(500).redirect("/submit-recipe");
    for (var prop in error.errors) {
      req.flash("infoErrors", error.errors[prop].message);
      res.status(500).redirect("/submit-recipe");
      break;
    }
  }
};

/**
 *PUT /update recipe
 * update recipe
 * /
 **/
const updateRecipe = async (req, res) => {
  try {
    let infoErrorObj = req.flash("infoErrors");
    let infoSubmitObj = req.flash("infoSubmit");
    let imageSizeObj = req.flash("infoImageSize");
    let recipeId = req.params.id;
    let recipe = await Recipe.findById(recipeId);
    res.status(200).render("update-recipe", {
      title: "Cooking Blog - Update Recipe",
      recipe,
      infoErrorObj,
      infoSubmitObj,
      imageSizeObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

/**
 *PUT /update recipe
 * update recipe
 * /
 **/
const updateRecipePut = async (req, res) => {
  try {
    let newImageName;

    // if (req.files == 0) {
    //   req.flash(
    //     "infoImageSize",
    //     "Please upload an image with size greater then 1mb"
    //   );
    // } else {
    //   let imageUploadFile = req.files.image;
    //   let imageExtension = imageUploadFile.name.split(".")[1];
    //   newImageName = uuidv4().split("-")[0] + "." + imageExtension;
    //   let uploadPath = path.resolve("./") + "/public/uploads/" + newImageName;
    //   imageUploadFile.mv(uploadPath, function (err) {
    //     if (err) {
    //       return res.status(500).send(err);
    //     } else {
    //       console.log("file uploaded");
    //     }
    //   });
    // }

    let recipeId = req.params.id;
    console.log(recipeId);
    const { name, description, email, ingredients, category, image } = req.body;
    const newRecipe = await Recipe.updateOne({
      name,
      description,
      email,
      ingredients,
      category,
      image: newImageName,
    });
    await newRecipe.save();
    req.flash("infoSubmit", "Recipe has been added");
    res.status(301).redirect("/submit-recipe");
  } catch (error) {
    // req.flash("infoErrors", error.errors);
    // res.status(500).redirect("/submit-recipe");
    for (var prop in error.errors) {
      req.flash("infoErrors", error.errors[prop].message);
      res.status(500).redirect("/submit-recipe");
      break;
    }
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
  } catch (error) {}
};

export {
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
};

// const loadRecipe = async () => {
//   try {
//     const recipe = await Recipe.insertMany([
//       // latest,
//       // thai,
//       // american,
//       // chainese,
//       {
//         name: "Jollof fried chicken",
//         description: `By far the most popular dish on both our street-food and restaurant menus is this super-crispy and succulent fried chicken recipe – I really shouldn’t be giving away the secret!`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "30 g (1oz) ground ginger",
//           "16 g (½ oz) garlic powder",
//           "10 g (0.3oz) ground onion",
//           "5 g (0.1oz) smoked paprika",
//           "20 g (0.7oz) dried chilli flakes",
//           "30 g (1oz) dried thyme",
//           "12.5 g (0.4oz) ground cinnamon",
//           "12.5 g (0.4oz) ground nutmeg",
//           "12.5 g (0.4oz) ground coriander",
//           "1 teaspoon sea salt",
//         ],
//         category: "American",
//         image: "125321183.webp",
//       },
//       {
//         name: "The ultimate chicken in milk",
//         description: `This is one of my absolute favourite dishes, it’s a real treat – you’ve got the lovely nutty, savoury flavours from the burnt butter, and citrussy, almost wine-gumminess of the slow-cooked lemon. It’s certainly not an everyday meal, but it’s just beautiful for a weekend lunch or a special occasion. ”`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 x 1.8 kg whole free-range chicken",
//           "1 teaspoon fennel seeds",
//           "200 g unsalted butter",
//           "1 bulb of garlic",
//           "2 onions",
//           "2 bulbs of fennel",
//           "1 lemon",
//           "1 large bunch of fresh sage (30g)",
//           "mixed-colour, if possible",
//           "1- inch stick of cinnamon",
//           "1–1.5 litres whole milk",
//         ],
//         category: "American",
//         image: "114185880.webp",
//       },
//       {
//         name: "Sesame roast chicken",
//         description: `Preheat the oven to 180°C/350°F/gas 4. In a blender, blitz the kimchi, peeled ginger, 1 tablespoon each of red wine vinegar and olive oil and 100ml of water until very smooth. In a roasting tray, rub one third of the kimchi dressing all over the chicken, getting into all the nooks and crannies. Pour 150ml of water into the tray, then roast for 1 hour 20 minutes, or until golden and cooked through. Halfway through, add another 150ml of water, baste with the juices and scrape up any sticky bits. Spoon another third of the dressing into a small bowl, mix with the honey and put aside. Drain the tofu and blitz with the rest of the dressing in the blender. Toast the sesame seeds in a non-stick frying pan until lightly golden, then set aside.`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "300 g kimchi",
//           "4 cm piece of ginger",
//           "red wine vinegar",
//           "olive oil",
//           "1 x 1.5 kg free-range whole chicken",
//           "2 tablespoons runny honey",
//           "300 g silken tofu",
//           "60 g sesame seeds",
//           "1 mug of basmati rice , (300g)",
//           "2 x 320 g packs of mixed stir-fry veg",
//           "extra virgin olive oil",
//         ],
//         category: "American",
//         image: "109469711.webp",
//       },
//       {
//         name: "Meatballs & pasta",
//         description: `This really easy beef and pork meatball recipe with simple tomato sauce delivers big on flavour – a simple, wholesome dinner for the whole family`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "12 Jacob's cream crackers",
//           "4 sprigs of fresh rosemary",
//           "2 heaped teaspoons Dijon mustard",
//           "500 g quality minced beef, pork, or a",
//           "mixture of the two",
//           "1 heaped tablespoon dried oregano",
//           "1 large free-range egg",
//           "olive oil",
//           "1 bunch of fresh basil",
//           "1 medium onion",
//           "2 cloves of garlic",
//         ],
//         category: "Thai",
//         image: "331_1_1436865256.webp",
//       },
//       {
//         name: "Whole roasted ricotta pasta",
//         description: `Brilliantly simple, this big-flavour pasta dish can be prepped in minutes, with incredible flavour and texture built up from its time in the oven. Kissed with herbs, oil and vinegar, this baked ricotta is a thing of real beauty`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 bunch of fresh oregano , (30g)",
//           "3 cloves of garlic",
//           "olive oil",
//           "red wine vinegar",
//           "400 g mixed-colour cherry tomatoes",
//           "1 red pepper",
//           "1 yellow pepper",
//           "1 onion",
//           "2 fresh red chillies",
//           "1 tablespoon baby capers",
//           "250 g quality ricotta cheese",
//           "450 g rigatoni pasta",
//         ],
//         category: "Thai",
//         image: "117867065.webp",
//       },
//       {
//         name: "Buddy’s tuna pasta",
//         description: `A delicious family meal that’s easy to put together and makes the most of store-cupboard heroes. Double batch the sauce to stash in the freezer for future meals. `,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 leek",
//           "½ a fresh chilli , optional",
//           "1 clove of garlic",
//           "1 x 400 g tin of quality plum tomatoes",
//           "1 x 80 g tin of tuna in spring water, from sustainable sources",
//           "130 g dried spaghetti",
//           "2 sprigs of fresh basil",
//           "Parmesan cheese , to serve",
//         ],
//         category: "Thai",
//         image: "123301865.webp",
//       },
//       {
//         name: "Orzo pasta",
//         description: `ON THE DAY Preheat the oven to 150°C/300°F/gas 2. In a large roasting tray, mix the harissa with 1 tablespoon each of red wine vinegar and olive oil and a pinch of sea salt and black pepper. Add the tomatoes on the vines, trim and add the whole spring onions, then break up the garlic, squash the unpeeled cloves and add to the tray. Gently toss together, roast for 1 hour, then remove.        `,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 teaspoon rose harissa",
//           "red wine vinegar",
//           "olive oil",
//           "1 kg ripe cherry tomatoes , on the vine",
//           "1 bunch of spring onions",
//           "1 bunch of garlic",
//           "1 bunch of soft herbs (30g) , such as basil, dill, mint",
//           "500 g frozen broad beans , (or fresh, if it’s the season)",
//           "500 g dried orzo pasta",
//           "extra virgin olive oil",
//         ],
//         category: "Thai",
//         image: "128036835.webp",
//       },
// {
//   name: "Classic ratatouille",
//   description: `This moreish Mediterranean-style vegetable stew is perfect for a super-healthy midweek supper.`,
//   email: "recipeemail@raddy.co.uk",
//   ingredients: [
//     " 2 red onions",
//     "4 cloves of garlic",
//     " 2 aubergines",
//     "3 courgettes",
//     "3 red or yellow peppers",
//     "6 ripe tomatoes",
//     " ½ a bunch of fresh basil , (15g)",
//     "olive oil",
//     "a few sprigs of fresh thyme",
//     "1 x 400 g tin of quality plum tomatoes",
//     " 1 tablespoon balsamic vinegar",
//     " ½ a lemon",
//   ],
//   category: "Chinese",
//   image: "1571_2_1437661403.webp",
// },
//       {
//         name: "Classic gumbo",
//         description: `If you’ve never made gumbo before, this is a good place to start. Once you have perfected this foundational recipe, the sky is the limit when it comes to what you can do with it — you can add a savoury protein such as my Barley Sausage (page 57 of Mississippi Vegan) or Smoky Baked Tofu (page 164). For a lighter and more vegetable-focused version of this dish, try using shredded artichoke hearts, large chunks of carrots, squash, or zucchini.`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           " 2 cups chopped onion , (1 medium)",
//           " 2 cups chopped celery , (about 4 large stalks)",
//           " 1½ cups chopped green bell pepper , (about 1 large)",
//           " ½ cup diced red bell pepper , (about 1 small)",
//           "½ cup minced garlic",
//           "8 cups vegetable broth",
//           "1 x 14.5-ounce can fire-roasted diced tomatoes",
//           "1 cup diced fresh tomatoes",
//           "1 tablespoon tomato paste",
//           "1 tablespoon ume plum vinegar",
//           " 1 tablespoon vegan Worcestershire sauce",
//           " 2 tablespoons + ½ cup chopped fresh parsley , plus more for garnish",
//           " 2 tablespoons chopped fresh oregano",
//           "1 tablespoon chopped fresh thyme",
//           "1 tablespoon minced jalapeño pepper , (optional)",
//           " 1 teaspoon stone-ground mustard , or Creole mustard",
//           " 1 teaspoon liquid smoke",
//           " 1 cup peanut oil",
//           "1¼ cups all-purpose flour",
//           " 6 to 8 bay leaves",
//           "½ cup chopped green onions , plus more for garnish",
//           "2 to 3 cups chopped okra , or desired amount",
//           "sea salt",
//           "freshly cracked black pepper",
//           "3 to 4 cups cooked rice , for serving",
//         ],
//         category: "Chinese",
//         image: "129244396.webp",
//       },
//     ]);
//     console.log(recipe);
//   } catch (error) {
//     console.log(error);
//   }
// };
// loadRecipe();
