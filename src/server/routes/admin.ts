import { Request, Response, Router } from "express";
import post from "../models/post";
import User from "../models/user";
import bcrypt from "bcrypt";

const router = Router();

const adminLayout = "../views/layouts/admin";

// Get - Login / Register page
router.get("/admin", (req: Request, res: Response) => {
  try {
    const locals = {
      title: "Admin",
      description: "Description for Admin route",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.error(error);
  }
});

// Post - Login check
router.post("/admin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid Crendtials" });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user?.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Crendtials" });
      }
    }

    res.render("admin/index");
  } catch (error) {
    console.error(error);
  }
});

export default router;
