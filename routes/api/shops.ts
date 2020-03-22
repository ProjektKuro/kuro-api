import {
  Request,
  Response,
  Router,
  NextFunction
} from 'express';
import mongoose from "mongoose";
import Shop from '../../models/Shop';
import Product from '../../models/Product';

const shopRoutes = Router();

shopRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.find({})
      .populate({ path: 'products', model: Product })
      .then(shops => {
        if (!shops) { return res.sendStatus(404); }

        return res.json({ shops });
      }).catch(next);
  }
);

shopRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const shop = new Shop();

    shop.name = req.body.shop.name;
    shop.longitude = req.body.shop.longitude;
    shop.latitude = req.body.shop.latitude;

    shop.save().then(shop => {
      if (!shop) { return res.sendStatus(404); }
      return res.json({ shop });
    })
      .catch(next);
  }
);

shopRoutes.get('/:shopId',
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate({ path: 'products', model: Product })
      .then(shop => {
        if (!shop) {
          return res.sendStatus(404);
        }

        return res.json({ shop });
      })
      .catch(next);
  }
);

shopRoutes.put('/:shopId',
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate({ path: 'products', model: Product })
      .then(shop => {
        if (!shop) { return res.sendStatus(404); }
        // only update fields that were actually passed...
        if (typeof req.body.product.name !== 'undefined') {
          shop.name = req.body.product.name;
        }
        if (typeof req.body.product.latitude !== 'undefined') {
          shop.latitude = req.body.product.latitude;
        }
        if (typeof req.body.product.longitude !== 'undefined') {
          shop.longitude = req.body.product.longitude;
        }

        return shop.save().then(function () {
          return res.json({ shop });
        });
      })
      .catch(next);
  }
);

shopRoutes.post('/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId).then((shop) => {
      if (!shop) { return res.sendStatus(404); }
      shop._id = mongoose.Types.ObjectId();
      // Important to save as new document
      shop.isNew = true;
      return shop.save().then(function () {
        return res.json({ shop });
      });
    }).catch(next);
  });

shopRoutes.delete('/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId).then((shop) => {
      if (!shop) { return res.sendStatus(404); }
      return shop.remove().then(function () {
        return res.json({ shop });
      });
    }).catch(next);
  });

shopRoutes.get('/:shopId/products',
  // auth.required,
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate({ path: 'products', model: Product })
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
shopRoutes.put('/:shopId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
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
