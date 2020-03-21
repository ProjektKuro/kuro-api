import mongoose from "mongoose";
import {
  Request,
  Response,
  Router,
  NextFunction
} from "express";
import passport from "passport";
import { model } from "mongoose";
import { auth } from "../auth";
import User from "../../models/User";

const router = Router();
router.get(
  '/user/:id?',
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.params.id).then((user) => {
      if (!user) { return res.sendStatus(404); }

      return res.json({ user: user });
    }).catch(next);
  });

router.get(
  '/users',
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.find({}).then((user) => {
      if (!user) { return res.sendStatus(404); }

      return res.json({ user: user });
    }).catch(next);
  });

router.put(
  '/user/:id',
  // auth.required,
  (req, res, next) => {
    console.log(req.params.id)
    User.findById(req.params.id).then((user) => {
      if (!user) {
        return res.sendStatus(401);
      }
      // only update fields that were actually passed...
      if (typeof req.body.user.username !== 'undefined') {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== 'undefined') {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.bio !== 'undefined') {
        user.bio = req.body.user.bio;
      }
      if (typeof req.body.user.image !== 'undefined') {
        user.image = req.body.user.image;
      }
      // if (typeof req.body.user.password !== 'undefined') {
      //   user.setPassword(req.body.user.password);
      // }

      return user.save().then(function () {
        return res.json({ user: user });
      });
    }).catch(next);
  });

router.post(
  '/users/login',
  (req, res, next) => {
    // if (!req.body.user.email) {
    //   return res.status(422).json({ errors: { email: "can't be blank" } });
    // }

    // if (!req.body.user.password) {
    //   return res.status(422).json({ errors: { password: "can't be blank" } });
    // }

    // passport.authenticate('local', { session: false }, function (err, user, info) {
    //   if (err) { return next(err); }

    //   if (user) {
    //     user.token = user.generateJWT();
    //     return res.json({ user: user.toAuthJSON() });
    //   } else {
    //     return res.status(422).json(info);
    //   }
    // })(req, res, next);
  });

router.post('/users',
  (req, res, next) => {
    var user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    // user.setPassword(req.body.user.password);

    user.save().then(function () {
      return res.json({ user: user }); // .toAuthJSON() });
    }).catch(next);
  });

export default router;
