import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const locals = {
    title: "home title",
    description: "description for home page",
  };
  res.render("index", { locals });
});

export default router;
