import express from "express";
import dotenv from "dotenv";
import expressLayout from "express-ejs-layouts";
import router from "./server/routes/main";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5001;

// public and statics dir
app.use(express.static("public"));

//Template Engine
app.use(expressLayout);
app.set("layout", path.join(__dirname, "/views/layouts/main"));
app.set("views", path.join(__dirname, "/views/"));
app.set("view engine", "ejs");

//Server Routes
app.use("/", router);

app.listen(port, () => {
  console.log(`first express app is running on port=${port}`);
});
