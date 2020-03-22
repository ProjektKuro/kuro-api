import {
  Request,
  Response,
  Router,
  NextFunction
} from 'express';
import mongoose from "mongoose";
import Category from '../../models/Category';
import Product from '../../models/Product';

const categoryRoutes = Router();

categoryRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    Category.find({})
      .populate({ path: 'products', model: Product })
      .then(categories => {
        if (!categories) { return res.sendStatus(404); }

        return res.json({ categories });
      }).catch(next);
  }
);

categoryRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const category = new Category();

    category.name = req.body.category.name;
    category.description = req.body.category.description;

    category.save().then(category => {
      if (!category) { return res.sendStatus(404); }
      return res.json({ category });
    })
      .catch(next);
  }
);

categoryRoutes.get('/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId)
      .populate({ path: 'products', model: Product })
      .then(category => {
        if (!category) { return res.sendStatus(404); }

        return res.json({ category });
      })
      .catch(next);
  }
);

categoryRoutes.put('/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId)
      .populate({ path: 'products', model: Product })
      .then(category => {
        if (!category) { return res.sendStatus(404); }
        // only update fields that were actually passed...
        if (typeof req.body.category.name !== 'undefined') {
          category.name = req.body.category.name;
        }
        if (typeof req.body.category.description !== 'undefined') {
          category.description = req.body.category.description;
        }

        return category.save().then(function () {
          return res.json({ category });
        });
      })
      .catch(next);
  }
);

categoryRoutes.post('/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId).then((category) => {
      if (!category) { return res.sendStatus(404); }
      category._id = mongoose.Types.ObjectId();
      // Important to save as new document
      category.isNew = true;
      return category.save().then(function () {
        return res.json({ category });
      });
    }).catch(next);
  });

categoryRoutes.delete('/:categoryId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId).then((category) => {
      if (!category) { return res.sendStatus(404); }
      return category.remove().then(function () {
        return res.json({ category });
      });
    }).catch(next);
  });

categoryRoutes.get('/:categoryId/products',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId)
      .populate({ path: 'products', model: Product })
      .then(category => {
        if (!category) { return res.sendStatus(404); }

        return res.json({ products: category.products });
      })
      .catch(next);
  }
);

/**
 * Adds an existing product by id to a category by id
 */
categoryRoutes.post('/:categoryId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Product.findById(req.params.productId)
      .then((category) => {
        if (!category) { return res.sendStatus(404); }
        return Category.findOneAndUpdate(
          { _id: req.params.categoryId },
          { $push: { products: category } }).then((category) => {
            if (!category) { return res.sendStatus(404); }
            return res.json({ products: category.products });
          });
      }).catch(next);
  });

/**
 * Updates a product by id in a category by id
 */
categoryRoutes.put('/:categoryId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId)
      .populate({ path: 'products', model: Product })
      .then((category) => {
        if (!category) { return res.sendStatus(401); }
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

categoryRoutes.delete('/:categoryId/products/:productId',
  (req: Request, res: Response, next: NextFunction) => {
    Category.findById(req.params.categoryId)
      .populate({ path: 'products', model: Product })
      .then((category) => {
        if (!category) { return res.sendStatus(404); }
        // Find the product
        return Product.findById(req.params.productId)
          .then((product) => {
            if (!product) { return res.sendStatus(404); }
            return category.update({ products: product._id }, {
              '$pull': { products: product._id }
            }).then(() => {
              return res.json({ products: category.products });
            });
          });
      }).catch(next);
  });

export default categoryRoutes;
