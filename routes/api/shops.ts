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
import { parseIncludes } from '../helper';

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
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('products') !== -1) { include.push({ path: 'products', model: Product }); }
      if (requestedIncludes.indexOf('address') !== -1) { include.push({ path: 'address', model: Address }); }
    }
    // if (!!req.query.q) {
    //   find['$text'] = { "$search": req.query.q }
    // }
    const perPage = +req.query.pageSize || 100;
    const page = +req.query.page || 0;

    Shop.find(find)
      .limit(perPage)
      .skip(perPage * page)
      .populate(include)
      .then(shops => {
        if (!shops) { return res.sendStatus(404); }

        return res.json({ shops });
      }).catch(next);
  }
);

shopRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const shop = new Shop();
    if (typeof req.body.shop.name !== 'undefined') {
      shop.name = req.body.shop.name;
    }
    if (typeof req.body.shop.location !== 'undefined') {
      if (
        typeof req.body.shop.location.latitude !== 'undefined' &&
        typeof req.body.shop.location.longitude !== 'undefined'
      ) {
        shop.location = {
          type: "Point",
          coordinates: [req.body.shop.location.latitude, req.body.shop.location.longitude]
        }
      }
    }
    if (typeof req.body.shop.products !== 'undefined') {
      shop.products = req.body.shop.products;
    }
    if (typeof req.body.shop.stock !== 'undefined') {
      typeof req.body.shop.stock.forEach(s =>
        shop.stock.push({ product: s.product, quantity: s.quantity, updatedAt: new Date() })
      );
    }

    shop.save().then(shop => {
      if (!shop) { return res.sendStatus(404); }
      return res.json({ shop });
    }).catch(next);
  }
);

shopRoutes.get('/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('products') !== -1) { include.push({ path: 'products', model: Product }); }
      if (requestedIncludes.indexOf('address') !== -1) { include.push({ path: 'address', model: Address }); }
    }
    Shop.findById(req.params.shopId)
      .populate(include)
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
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('products') !== -1) { include.push({ path: 'products', model: Product }); }
      if (requestedIncludes.indexOf('address') !== -1) { include.push({ path: 'address', model: Address }); }
    }
    Shop.findById(req.params.shopId)
      .populate(include)
      .then(shop => {
        if (!shop) { return res.sendStatus(404); }
        // only update fields that were actually passed...
        if (typeof req.body.shop.name !== 'undefined') {
          shop.name = req.body.shop.name;
        }
        if (typeof req.body.shop.location !== 'undefined') {
          if (
            typeof req.body.shop.location.latitude !== 'undefined' &&
            typeof req.body.shop.location.longitude !== 'undefined'
          ) {
            shop.location = {
              type: "Point",
              coordinates: [req.body.shop.location.latitude, req.body.shop.location.longitude]
            }
          }
        }
        if (typeof req.body.shop.products !== 'undefined') {
          shop.products = req.body.shop.products;
        }
        if (typeof req.body.shop.stock !== 'undefined') {
          typeof req.body.shop.stock.forEach(s =>
            shop.stock.push({ product: s.product, quantity: s.quantity, updatedAt: new Date() })
          );
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

export default shopRoutes;
