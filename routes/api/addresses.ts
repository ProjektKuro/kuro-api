import {
  Request,
  Response,
  Router,
  NextFunction
} from 'express';
import mongoose from "mongoose";
import Address from '../../models/Address';
import Shop from '../../models/Shop';
import { parseIncludes } from '../helper';

const addressRoutes = Router();

addressRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('shops') !== -1) { include.push({ path: 'shops', model: Shop }); }
    }
    const perPage = +req.query.pageSize || 100;
    const page = +req.query.page || 0;

    Address.find({})
      .limit(perPage)
      .skip(perPage * page)
      .populate(include)
      .then(addresses => {
        if (!addresses) { return res.sendStatus(404); }

        return res.json({ addresses });
      }).catch(next);
  }
);

addressRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const address = new Address();

    address.address = req.body.address.address;
    address.address2 = req.body.address.address2;
    address.district = req.body.address.district;
    address.city = req.body.address.city;
    address.postalCode = req.body.address.postalCode;

    address.save().then(address => {
      if (!address) { return res.sendStatus(404); }
      return res.json({ address });
    }).catch(next);
  }
);

addressRoutes.get('/:addressId',
  (req: Request, res: Response, next: NextFunction) => {
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('shops') !== -1) { include.push({ path: 'shops', model: Shop }); }
    }
    Address.findById(req.params.addressId)
      .populate(include)
      .then(address => {
        if (!address) { return res.sendStatus(404); }

        return res.json({ address });
      })
      .catch(next);
  }
);

addressRoutes.put('/:addressId',
  (req: Request, res: Response, next: NextFunction) => {
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('shops') !== -1) { include.push({ path: 'shops', model: Shop }); }
    }
    Address.findById(req.params.addressId)
      .populate(include)
      .then(address => {
        if (!address) { return res.sendStatus(404); }
        // only update fields that were actually passed...
        if (typeof req.body.address.address !== 'undefined') {
          address.address = req.body.address.address;
        }
        if (typeof req.body.address.address2 !== 'undefined') {
          address.address2 = req.body.address.address2;
        }
        if (typeof req.body.address.districtdistrict !== 'undefined') {
          address.district = req.body.address.district;
        }
        if (typeof req.body.address.city !== 'undefined') {
          address.city = req.body.address.city;
        }
        if (typeof req.body.address.postalCode !== 'undefined') {
          address.postalCode = req.body.address.postalCode;
        }

        return address.save().then(function () {
          return res.json({ address });
        });
      })
      .catch(next);
  }
);

addressRoutes.post('/:addressId',
  (req: Request, res: Response, next: NextFunction) => {
    Address.findById(req.params.addressId).then((address) => {
      if (!address) { return res.sendStatus(404); }
      address._id = mongoose.Types.ObjectId();
      // Important to save as new document
      address.isNew = true;
      return address.save().then(function () {
        return res.json({ address });
      });
    }).catch(next);
  });

addressRoutes.delete('/:addressId',
  (req: Request, res: Response, next: NextFunction) => {
    Address.findById(req.params.addressId).then((address) => {
      if (!address) { return res.sendStatus(404); }
      return address.remove().then(function () {
        return res.json({ address });
      });
    }).catch(next);
  });

addressRoutes.get('/:addressId/shops',
  (req: Request, res: Response, next: NextFunction) => {
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('shops') !== -1) { include.push({ path: 'shops', model: Shop }); }
    }
    Address.findById(req.params.addressId)
      .populate(include)
      .then(address => {
        if (!address) { return res.sendStatus(404); }

        return res.json({ shop: address.shop });
      })
      .catch(next);
  }
);

addressRoutes.delete('/:addressId/shops/:shopId',
  (req: Request, res: Response, next: NextFunction) => {
    const include = [];
    if (req.query.include) {
      let requestedIncludes = parseIncludes(req.query.include);
      if (requestedIncludes.indexOf('shops') !== -1) { include.push({ path: 'shops', model: Shop }); }
    }
    Address.findById(req.params.addressId)
      .populate(include)
      .then((address) => {
        if (!address) { return res.sendStatus(404); }
        // Find the shop
        return Shop.findById(req.params.shopId)
          .then((shop) => {
            if (!shop) { return res.sendStatus(404); }
            return address.update({ shops: shop._id }, {
              '$pull': { shops: shop._id }
            }).then(() => {
              return res.json({ shop: address.shop });
            });
          });
      }).catch(next);
  });

export default addressRoutes;
