import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const local = {
    title: "home title",
    description: "description for home page",
  };
  res.render("index", { local });
});

export default router;
