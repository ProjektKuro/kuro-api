import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import users from "./users";
import profiles from "./profiles";
import products from "./products";
// import shops from "./shops";

const router = Router();
router.use('/', users);
router.use('/products', products);
router.use('/profiles', profiles);
// router.use('/shops', shops);

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
