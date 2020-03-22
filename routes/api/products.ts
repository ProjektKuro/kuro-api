import {
  Request,
  Response,
  Router,
  NextFunction
} from "express";
import mongoose from "mongoose";
import Product from "../../models/Product";
import Shop from "../../models/Shop";
import Category from "../../models/Category";

const productRoutes = Router();

/**
* Get route for all Products
*/
productRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    Product.find({})
      .populate([
        { path: 'shops', model: Shop },
        { path: 'categories', model: Category }
      ])
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
    Product.findById(req.params.productId)
      .populate([
        { path: 'shops', model: Shop },
        { path: 'categories', model: Category }
      ])
      .then((product) => {
        if (!product) { return res.sendStatus(401); }
        // Find the store
        return Shop.findById(req.params.shopId)
          .then((shop) => {
            if (!shop) { return res.sendStatus(404); }
            // only update fields that were actually passed...
            if (typeof req.body.shop.name !== 'undefined') {
              shop.name = req.body.shop.name;
            }
            if (typeof req.body.shop.latitude !== 'undefined') {
              shop.latitude = req.body.shop.latitude;
            }
            if (typeof req.body.shop.longitude !== 'undefined') {
              shop.longitude = req.body.shop.longitude;
            }

            return shop.save().then(function () {
              return res.json({ product });
            });
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

productRoutes.get('/:productId/categories',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .populate({ path: 'categories', model: Category })
      .then((product) => {
        if (!product) { return res.sendStatus(404); }

        return res.json({ categories: product.categories });
      }).catch(next);
  });

productRoutes.put('/:productId/categories/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .populate({ path: 'categories', model: Category })
      .then((product) => {
        if (!product) { return res.sendStatus(401); }
        // Find the store
        return Category.findById(req.params.categoryId)
          .then((category) => {
            if (!category) { return res.sendStatus(404); }
            // only update fields that were actually passed...
            if (typeof req.body.category.name !== 'undefined') {
              category.name = req.body.category.name;
            }
            if (typeof req.body.category.latitude !== 'undefined') {
              category.description = req.body.category.latitude;
            }

            return category.save().then(function () {
              return res.json({ product });
            });
          });
      }).catch(next);
  });

productRoutes.post('/:productId/categories/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId)
      .then((category) => {
        if (!category) { return res.sendStatus(404); }
        return Product.findOneAndUpdate(
          { _id: req.params.productId },
          { $push: { categories: category } })
          .populate({ path: 'categories', model: Category })
          .then((product) => {
            if (!product) { return res.sendStatus(404); }
            return res.json({ categories: product.categories });
          });
      }).catch(next);
  });

productRoutes.delete('/:productId/categories/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .populate({ path: 'categories', model: Category })
      .then((product) => {
        if (!product) { return res.sendStatus(404); }
        // Find the store
        return Category.findById(req.params.categoryId)
          .then((category) => {
            if (!category) { return res.sendStatus(404); }
            return product.update({ categories: category._id }, {
              '$pull': { categories: category._id }
            }).then(() => {
              return res.json({ categories: product.categories });
            });
          });
      }).catch(next);
  });

export default productRoutes;
