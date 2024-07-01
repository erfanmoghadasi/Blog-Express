import { Router, Request, Response } from "express";
import post from "../models/post";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const locals = {
    title: "home title",
    description: "description for home page",
  };

  try {
    const perPage = 5;
    const currentPage = req.query.page ?? 1;

    const data = await post
      .aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * +currentPage - perPage)
      .exec();

    const count = await post.countDocuments({});
    const nextPage = +currentPage + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: currentPage,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
