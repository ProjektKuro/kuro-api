import {
  Request,
  Response,
  Router,
  NextFunction
} from "express";
import mongoose from "mongoose";
import Product from "../../models/Product";
import Shop from "../../models/Shop";

const productRoutes = Router();

/**
* Get route for all Products
*/
productRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    Product.find({})
      .populate({ path: 'shops', model: Shop })
      .then((products) => {
        if (!products) { return res.sendStatus(404); }

        return res.json({ products });
      }).catch(next);
  });

productRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const product = new Product();

    product.name = req.body.product.name;
    product.description = req.body.product.description;
    product.quantity = req.body.product.quantity;

    product.save().then(function () {
      return res.json({ product }); // .toAuthJSON() });
    }).catch(next);
  });

/**
 * Get route for the Product with id {id}
 */
productRoutes.get('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .populate({ path: 'shops', model: Shop })
      .then((product) => {
        if (!product) { return res.sendStatus(404); }

        return res.json({ product });
      }).catch(next);
  });

productRoutes.put('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).then((product) => {
      if (!product) { return res.sendStatus(401); }
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
    }).catch(next);
  });

productRoutes.post('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).then((product) => {
      if (!product) { return res.sendStatus(404); }
      product._id = mongoose.Types.ObjectId();
      // Important to save as new document
      product.isNew = true;
      return product.save().then(function () {
        return res.json({ product });
      });
    }).catch(next);
  });

productRoutes.delete('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).then((product) => {
      if (!product) { return res.sendStatus(404); }
      return product.remove().then(function () {
        return res.json({ product });
      });
    }).catch(next);
  });

productRoutes.get('/:productId/shops',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .populate({ path: 'shops', model: Shop })
      .then((product) => {
        if (!product) { return res.sendStatus(404); }

        return res.json({ shops: product.shops });
      }).catch(next);
  });

productRoutes.put('/:productId/shops/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.id)
    Product.findById(req.params.id).then((product) => {
      if (!product) {
        return res.sendStatus(401);
      }
      // only update fields that were actually passed...
      // if (typeof req.body.product.productname !== 'undefined') {
      //   product.productname = req.body.product.productname;
      // }
      // if (typeof req.body.product.email !== 'undefined') {
      //   product.email = req.body.product.email;
      // }
      // if (typeof req.body.product.bio !== 'undefined') {
      //   product.bio = req.body.product.bio;
      // }
      // if (typeof req.body.product.image !== 'undefined') {
      //   product.image = req.body.product.image;
      // }
      // if (typeof req.body.product.password !== 'undefined') {
      //   product.setPassword(req.body.product.password);
      // }

      return product.save().then(function () {
        return res.json({ product: product });
      });
    }).catch(next);
  });

productRoutes.post('/:productId/shops/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    Shop.findById(req.params.shopId)
      .then((shop) => {
        if (!shop) { return res.sendStatus(404); }
        return Product.findOneAndUpdate(
          { _id: req.params.productId },
          { $push: { shops: shop } })
          .populate({ path: 'shops', model: Shop })
          .then((product) => {
            if (!product) { return res.sendStatus(404); }
            return res.json({ shops: product.shops });
          });
      }).catch(next);
  });

productRoutes.delete('/:productId/shops/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .populate({ path: 'shops', model: Shop })
      .then((product) => {
        if (!product) { return res.sendStatus(404); }
        // Find the store
        return Shop.findById(req.params.shopId)
          .then((shop) => {
            if (!shop) { return res.sendStatus(404); }
            return product.update({ shops: shop._id }, {
              '$pull': { shops: shop._id }
            }).then(() => {
              return res.json({ shops: product.shops });
            });
          });
      }).catch(next);
  });

export default productRoutes;
