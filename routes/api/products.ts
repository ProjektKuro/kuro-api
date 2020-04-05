import {
  Request,
  Response,
  Router,
  NextFunction
} from "express";
import mongoose from "mongoose";
import Product from "../../models/Product";

const productRoutes = Router();

/**
* Get route for all Products
*/
productRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    const perPage = +req.query.pageSize || 100;
    const page = +req.query.page || 0;

    Product.find({})
      .limit(perPage)
      .skip(perPage * page)
      .then((products) => {
        if (!products) { return res.sendStatus(404); }

        return res.json({ products });
      }).catch(next);
  });

productRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const product = new Product();

    // only update fields that were actually passed...
    if (typeof req.body.product.name !== 'undefined') {
      product.name = req.body.product.name;
    }
    if (typeof req.body.product.description !== 'undefined') {
      product.description = req.body.product.description;
    }
    if (typeof req.body.product.categories !== 'undefined') {
      const c = req.body.product.categories
      if (Array.isArray(c)) {
        if (c.every(cat => typeof cat === 'string')) {
          product.categories = c;
        }
      }
    }

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
      if (typeof req.body.product.categories !== 'undefined') {
        const c = req.body.product.categories
        if (!Array.isArray(c)) { return res.sendStatus(422); }
        if (c.some(cat => typeof cat === 'string')) { return res.sendStatus(422); }
        product.categories = c;
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

export default productRoutes;
