import { NextFunction, Request, Response, Router } from "express";
import post from "../models/post";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

const adminLayout = "../views/layouts/admin";

// Middlewares
// check login
const authMiddleware = (
  req: Request<never, never, { userId: string }, never>,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SESSION_SECRET as string
    ) as jwt.JwtPayload;
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

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

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string
      );
      res.cookie("roken", token, { httpOnly: true });
      res.redirect("/dashboard");
    }

    res.render("admin/index");
  } catch (error) {
    console.error(error);
  }
});

// Post - Admin Register
router.post("register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User created", user });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
