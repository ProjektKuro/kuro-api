import {
  Request,
  Response,
  Router,
  NextFunction
} from 'express';
import mongoose from "mongoose";
import Address from '../../models/Address';
import Shop from '../../models/Shop';
import Product from '../../models/Product';
import { request } from 'http';

const shopRoutes = Router();

shopRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    let find = {};
    if (req.query.lat && req.query.long) {
      find = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [req.query.lat, req.query.long],
            },
            $maxDistance: +req.query.distance,
          },
        },
      };
    }
    if (!!req.query.q) {
      find['$text'] = { "$search": req.query.q }
    }
    Shop.find(find)
      .populate([
        { path: 'products', model: Product },
        { path: 'address', model: Address }
      ])
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
    shop.location = {
      type: "Point",
      coordinates: [req.body.shop.latitude, req.body.shop.longitude]
    }

    shop.save().then(shop => {
      if (!shop) { return res.sendStatus(404); }
      return res.json({ shop });
    }).catch(next);
  }
);

shopRoutes.get('/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate([
        { path: 'products', model: Product },
        { path: 'address', model: Address }
      ])
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
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate([
        { path: 'products', model: Product },
        { path: 'address', model: Address }
      ])
      .then(shop => {
        if (!shop) { return res.sendStatus(404); }
        // only update fields that were actually passed...
        if (typeof req.body.shop.name !== 'undefined') {
          shop.name = req.body.shop.name;
        }
        if (
          typeof req.body.shop.latitude !== 'undefined' &&
          typeof req.body.shop.longitude !== 'undefined'
        ) {

          shop.location = {
            type: "Point",
            coordinates: [req.body.shop.latitude, req.body.shop.longitude]
          }
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
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate([
        { path: 'products', model: Product },
        { path: 'address', model: Address }
      ])
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
 * Updates a product by id in a shop by id
 */
shopRoutes.put('/:shopId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate([
        { path: 'products', model: Product },
        { path: 'address', model: Address }
      ])
      .then((shop) => {
        if (!shop) { return res.sendStatus(401); }
        // Find the store
        return Product.findById(req.params.productId)
          .then((product) => {
            if (!product) { return res.sendStatus(404); }
            // only update fields that were actually passed...
            if (typeof req.body.product.name !== 'undefined') {
              product.name = req.body.product.name;
            }
            if (typeof req.body.product.description !== 'undefined') {
              product.description = req.body.product.description;
            }
            if (typeof req.body.product.quantity !== 'undefined') {
              product.quantity = req.body.product.quantity;
            }

            return product.save().then(function () {
              return res.json({ product });
            });
          });
      }).catch(next);
  }
);

shopRoutes.delete('/:shopId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .populate([
        { path: 'products', model: Product },
        { path: 'address', model: Address }
      ])
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

/**
* Adds an existing address by id to a shop by id
*/
shopRoutes.post('/:shopId/addresses/:addressId',
  (req: Request, res: Response, next: NextFunction) => {
    Address.findById(req.params.addressId)
      .then((address) => {
        if (!address) { return res.sendStatus(404); }
        return Shop.findOneAndUpdate(
          { _id: req.params.shopId },
          { address: address }).then((shop) => {
            if (!shop) { return res.sendStatus(404); }
            return res.json({ address: shop.address });
          });
      }).catch(next);
  });

export default shopRoutes;
