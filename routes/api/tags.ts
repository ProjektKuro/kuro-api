import { Request, Response, Router, NextFunction } from "express";
import { model } from "mongoose";
import mongoose from "mongoose";
const article = model("Article");
// return a list of tags
const router = Router();
router.get('/', (req: Request, res: Response, next: NextFunction) {
  article
    .find()
    .distinct('tagList')
    .then((tags) => {
      return res.json({
        tags: tags
      });
    }).catch(next);
});

module.exports = router;
