import {
  NextFunction,
  Request,
  Response,
  Router
} from "express";
import users from "./users";
import profiles from "./profiles";

const router = Router();
router.use('/', users);
router.use('/profiles', profiles);

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
