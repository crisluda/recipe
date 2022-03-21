import express from "express";
import expressLayouts from "express-ejs-layouts";
import fileUpload from "express-fileupload";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import path from "path";
import morgan from "morgan";

import dotenv from "dotenv";
dotenv.config();

import { conn } from "./database/database.mjs";
conn();
import recipeRoutes from "./server/routes/recipeRoutes.mjs";

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("CookingBlogSecure"));
app.use(
  session({
    secret: "CookingBlogSecureSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", recipeRoutes);

app.listen(port, () => {
  console.log(`app is lintening on http://localhost:${port}`);
});
