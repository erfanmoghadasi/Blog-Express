import express from "express";
import dotenv from "dotenv";
import expressLayout from "express-ejs-layouts";
import mainRouter from "./server/routes/main";
import adminRouter from "./server/routes/admin";
import path from "path";
import connectDB from "./server/configs/db";
import { isActiveRoute } from "./server/helpers/routeHelper";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5001;

//database
connectDB();

// public and statics dir
app.use(express.static("public"));

// for passing data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Template Engine
app.use(expressLayout);
app.set("layout", path.join(__dirname, "/views/layouts/main"));
app.set("views", path.join(__dirname, "/views/"));
app.set("view engine", "ejs");

//Server Routes
app.use("/", mainRouter);
app.use("/", adminRouter);

app.listen(port, () => {
  console.log(`The express app is running on port=${port}`);
});

// Helper Methods
app.locals.isActiveRoute = isActiveRoute;
