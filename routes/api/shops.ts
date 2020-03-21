import mongoose from "mongoose";
import { Request, Response, Router, NextFunction } from "express";
import passport from "passport";
import { model } from "mongoose";
import { auth } from "../auth";
import Shop from "../../models/Shop";

const shopRoutes = Router();

shopRoutes.get(
  "/shops",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.find({})
      .then(user => {
        if (!user) {
          return res.sendStatus(404);
        }

        return res.json({ user: user });
      })
      .catch(next);
  }
);
shopRoutes.post(
  "/shops",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.find({})
      .then(user => {
        if (!user) {
          return res.sendStatus(404);
        }

        return res.json({ user: user });
      })
      .catch(next);
  }
);
shopRoutes.get(
  "/shops/:shopId",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.sendStatus(404);
        }

        return res.json({ user: user });
      })
      .catch(next);
  }
);
shopRoutes.get(
  "/shops/:shopId/products",
  // auth.required,
  (req, res, next) => {
    console.log(req.params.id);
    User.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.sendStatus(401);
        }

        return user.save().then(function() {
          return res.json({ user: user });
        });
      })
      .catch(next);
  }
);
shopRoutes.get(
  "/shops/:shopId/products/:productId",
  // auth.required,
  (req, res, next) => {
    console.log(req.params.id);
    User.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.sendStatus(401);
        }
          return user.save().then(function() {
          return res.json({ user: user });
        });
      })
      .catch(next);
  }
);
shopRoutes.post(
  "/shops/:shopId/products/:productId",
  // auth.required,
  (req, res, next) => {
    console.log(req.params.id);
    User.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.sendStatus(401);
        }
       
      })
      .catch(next);
  }
);

shopRoutes.put(
  "/shops/:shopId/products/:productId",
  // auth.required,
  (req, res, next) => {
    console.log(req.params.id);
    User.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.sendStatus(401);
        }
       
        return user.save().then(function() {
          return res.json({ user: user });
        });
      })
      .catch(next);
  }
);

export default shopRoutes;
