import mongoose from "mongoose";
import { Request, Response, Router, NextFunction } from "express";
import passport from "passport";
import { model } from "mongoose";
import { auth } from "../auth";
import Shop from "../../models/Shop";
import Product from "../../models/Product";

const shopRoutes = Router();

shopRoutes.get(
  "",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.find({})
      .then(shops => {
        if (!shops) {
          return res.sendStatus(404);
        }

        return res.json({ shops: shops });
      })
      .catch(next);
  }
);
shopRoutes.post(
  "",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    const shop = new Shop();

    shop.name = req.body.shop.name;
    shop.longitude = req.body.shop.longitude;
    shop.latitude = req.body.shop.latitude;

    shop
      .save()
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }
        return res.json({ shop });
      })
      .catch(next);
  }
);
shopRoutes.get(
  "/:shopId",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }

        return res.json({ shop: shop });
      })
      .catch(next);
  }
);
shopRoutes.get(
  "/:shopId/products",
  // auth.required,
  (req, res, next) => {
    Shop.findById(req.params.shopId)
      .populate({ path: "products", model: Product })
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }

        return res.json({ products: shop.products });
      })
      .catch(next);
  }
);
shopRoutes.get(
  "/:shopId/products/:productId",
  // auth.required,
  (req, res, next) => {
    Shop.findById(req.params.shopId)
      .populate({ path: "products", model: Product })
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }
        const productId = req.params.productId;
        const product = shop.products.filter(product => product._id === productId);
        return res.json({ products: product });
      })
      .catch(next);
  }
);
shopRoutes.post(
  "/:shopId/products/:productId",
  // auth.required,
  (req, res, next) => {
    Shop.findById(req.params.shopId)
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }
        if (!shop.products) {
          return res.sendStatus(500);
        }
        const product = new Product();
        product.name = req.body.productId;
        product.description = req.body.description;

        product.save().then(function () {
          return res.json({ product });
        }).catch(next);
        return res.sendStatus(500);
      })
      .catch(next);
      return res.sendStatus(500);
    }
);

// shopRoutes.put(
//   "/:shopId/products/:productId",
//   // auth.required,
//   (req, res, next) => {
//     console.log(req.params.id);
//     Shop.findById(req.params.id)
//       .then(user => {
//         if (!user) {
//           return res.sendStatus(401);
//         }

//         return user.save().then(function() {
//           return res.json({ user: user });
//         });
//       })
//       .catch(next);
//   }
// );

export default shopRoutes;
