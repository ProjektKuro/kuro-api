import {
  Request,
  Response,
  Router,
  NextFunction
} from "express";
import Product from "../../models/Product";
import Shop from "../../models/Shop";
import mongoose from "mongoose";

const productsRoutes = Router();

/**
* Get route for all Products
*/
productsRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    Product.find({}).then((products) => {
      if (!products) { return res.sendStatus(404); }

      return res.json({ products });
    }).catch(next);
  });

productsRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const product = new Product();

    product.name = req.body.product.name;
    product.description = req.body.product.description;

    product.save().then(function () {
      return res.json({ product }); // .toAuthJSON() });
    }).catch(next);
  });

/**
 * Get route for the Product with id {id}
 */
productsRoutes.get('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).then((product) => {
      if (!product) { return res.sendStatus(404); }

      return res.json({ product });
    }).catch(next);
  });

productsRoutes.put('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).then((product) => {
      if (!product) {
        return res.sendStatus(401);
      }
      // only update fields that were actually passed...
      if (typeof req.body.product.name !== 'undefined') {
        product.name = req.body.product.name;
      }
      if (typeof req.body.product.description !== 'undefined') {
        product.description = req.body.product.description;
      }

      return product.save().then(function () {
        return res.json({ product });
      });
    }).catch(next);
  });

productsRoutes.post('/:productId',
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

productsRoutes.delete('/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).then((product) => {
      if (!product) { return res.sendStatus(404); }
      return product.remove().then(function () {
        return res.json({ product });
      });
    }).catch(next);
  });

productsRoutes.get('/:productId/shops',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId).populate({ path: 'shops', model: Shop }).then((product) => {
      if (!product) { return res.sendStatus(404); }

      return res.json({ shops: product.shops });
    }).catch(next);
  });

productsRoutes.post('/:pid/shops',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.id).populate('shops').then((product) => {
      if (!product) { return res.sendStatus(404); }

      return res.json({ product });
    }).catch(next);
  });

productsRoutes.get('/:pid/shops/:sid',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.id).then((product) => {
      if (!product) { return res.sendStatus(404); }

      return res.json({ product });
    }).catch(next);
  });

productsRoutes.put('/:pid/shops/:sid',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.id).then((product) => {
      if (!product) {
        return res.sendStatus(401);
      }

      return product.save().then(function () {
        return res.json({ product: product });
      });
    }).catch(next);
  });

productsRoutes.post('/:pid/shops/:sid',
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

productsRoutes.delete('/:pid/shops/:sid',
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

export default productsRoutes;
