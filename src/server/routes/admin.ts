import { NextFunction, Request, Response, Router } from "express";
import Post from "../models/post";
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
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("errore tush ", error);
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

    res.render("admin/index", {
      locals,
      layout: adminLayout,
      currentRoute: "/admin",
    });
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
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    }

    res.render("admin/index");
  } catch (error) {
    console.error(error);
  }
});

// Get - Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const locals = {
        title: "Dashboard",
        description: "Dashboard descriptionnnnn . . .",
      };

      const data = await Post.find();

      res.render("admin/dashboard", {
        locals,
        data,
        layout: adminLayout,
        currentRoute: "/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// Post - Admin Register
router.post("/register", async (req: Request, res: Response) => {
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

// Get - create new post
router.get("/add-post", authMiddleware, async (req: Request, res: Response) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();

    res.render("admin/add-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.error(error);
  }
});

// Post - create new post
router.post(
  "/add-post",
  authMiddleware,
  async (
    req: Request<
      never,
      never,
      { title: string; body: string; userId: string },
      never
    >,
    res: Response
  ) => {
    try {
      await Post.create({
        title: req.body.title,
        body: req.body.body,
      });

      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }
);

// Get - edit post
router.get(
  "/edit-post/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const locals = {
        title: "Edit Post",
        description: "Simple Blog created with NodeJs, Express & MongoDb.",
      };

      const data = await Post.findOne({ _id: req.params.id });

      res.render("admin/edit-post", {
        locals,
        data,
        layout: adminLayout,
      });
    } catch (error) {
      console.error(error);
    }
  }
);

// Put - edit post
router.put(
  "/add-post/:id",
  authMiddleware,
  async (
    req: Request<
      { id: string },
      never,
      { title: string; body: string; userId: string },
      never
    >,
    res: Response
  ) => {
    try {
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now(),
      });

      res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
      console.error(error);
    }
  }
);

// Delete - post
router.delete(
  "/delete-post/:id",
  authMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      await Post.deleteOne({ _id: req.params.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }
);

//Get - Logout
router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
