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

// Get - Post By Id
router.get("/post/:id", async (req: Request, res: Response) => {
  try {
    const slug = req.params.id;

    const data = await post.findById({ _id: slug });

    const locals = {
      title: data?.title,
      description: "some fucin description . . .",
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.error(error);
  }
});

// Post - Search post
router.post("search", async (req: Request, res: Response) => {
  try {
    const locals = {
      title: "search",
      description: "some shitty description . . .",
    };

    const searchTerm: string = req.body.searchTerm;
    const searchWithNoSpecialChar = searchTerm?.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await post.find({
      $or: [
        { title: { $regex: new RegExp(searchWithNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchWithNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
