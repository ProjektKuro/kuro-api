import { Request, Response, Router, NextFunction } from "express";
import Shop from "../../models/Shop";
import Product from "../../models/Product";

const shopRoutes = Router();

shopRoutes.get("",
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
shopRoutes.post("",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    const shop = new Shop();

    shop.name = req.body.shop.name;
    shop.longitude = req.body.shop.longitude;
    shop.latitude = req.body.shop.latitude;

    shop.save().then(shop => {
      if (!shop) {
        return res.sendStatus(404);
      }
      return res.json({ shop });
    })
      .catch(next);
  }
);
shopRoutes.get("/:shopId",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }

        return res.json({ shop });
      })
      .catch(next);
  }
);
shopRoutes.put("/:shopId",
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }
        return res.json({ shop });
      })
      .catch(next);
  }
);
shopRoutes.get("/:shopId/products",
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

/**
 * Adds an existing product by id to a shop by id
 */
shopRoutes.post('/:shopId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .then((product) => {
        if (!product) { return res.sendStatus(404); }
        return Shop.findOneAndUpdate(
          { _id: req.params.shopId },
          { $push: { products: product } }).then((shop) => {
            if (!shop) { return res.sendStatus(404); }
            return res.json({ products: shop.products });
          });
      }).catch(next);
  });

/**
 * 
 */
shopRoutes.put("/:shopId/products/:productId",
  (req, res, next) => {
    Shop.findById(req.params.shopId)
      .then(shop => {
        if (!shop) { return res.sendStatus(404); }
        const bodyShop = req.body.shop;
        return bodyShop.save().then(() => {
          return res.json({ shop: shop });
        });
      })
      .catch(next);
  }
);

shopRoutes.delete('/:shopId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate({ path: 'products', model: Product })
      .then((shop) => {
        if (!shop) { return res.sendStatus(404); }
        // Find the product
        return Product.findById(req.params.productId)
          .then((product) => {
            if (!product) { return res.sendStatus(404); }
            return shop.update({ products: product._id }, {
              '$pull': { products: product._id }
            }).then(() => {
              return res.json({ products: shop.products });
            });
          });
      }).catch(next);
  });
export default shopRoutes;
