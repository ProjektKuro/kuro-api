import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import users from "./users";
import products from "./products";
import shops from "./shops";
import addresses from "./addresses";

const router = Router();
router.use('/users', users);
router.use('/products', products);
router.use('/shops', shops);
router.use('/addresses', addresses);

router.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

export default router;
