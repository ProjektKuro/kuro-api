import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";
import { auth } from "../auth";
const User = mongoose.model("User");
export const router = Router();
// Preload user profile on routes with ':username'
router.param(
  "username",
  (req: Request, res: Response, next: NextFunction, username: string) => {
    User.findOne({ username: username })
      .then(user => {
        if (!user) {
          return res.sendStatus(404);
        }

        req.profile = user;

        return next();
      })
      .catch(next);
  }
);

router.get(
  "/:username",
  auth.optional,
  (req: Request, res: Response, next: NextFunction) => {
    if (req.payload) {
      User.findById(req.payload.id).then(user => {
        if (!user) {
          return res.json({
            profile: req.profile.toProfileJSONFor(false)
          });
        }
        return res.json({
          profile: req.profile.toProfileJSONFor(user)
        });
      });
    } else {
      return res.json({
        profile: req.profile.toProfileJSONFor(false)
      });
    }
  }
);

router.post(
  "/:username/follow",
  auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    const profileId = req.profile._id;

    User.findById(req.payload.id)
      .then(function(user) {
        if (!user) {
          return res.sendStatus(401);
        }

        return user.follow(profileId).then(() => {
          return res.json({
            profile: req.profile.toProfileJSONFor(user)
          });
        });
      })
      .catch(next);
  }
);

router.delete("/:username/follow", auth.required, (req: Request, res: Response, next: NextFunction) => {
  const profileId = req.profile._id;

  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      return user.unfollow(profileId).then(function() {
        return res.json({
          profile: req.profile.toProfileJSONFor(user)
        });
      });
    })
    .catch(next);
});

module.exports = router;
