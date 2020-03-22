import mongoose from "mongoose";
import {
  Request,
  Response,
  Router,
  NextFunction
} from "express";
import User from "../../models/User";

const userRoutes = Router();

userRoutes.get('',
  (req: Request, res: Response, next: NextFunction) => {
    User.find({})
      .then(shops => {
        if (!shops) { return res.sendStatus(404); }

        return res.json({ shops });
      }).catch(next);
  }
);

userRoutes.post('',
  (req: Request, res: Response, next: NextFunction) => {
    const user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;

    user.save().then(user => {
      if (!user) { return res.sendStatus(404); }
      return res.json({ user });
    })
      .catch(next);
  }
);

userRoutes.get('/:userId',
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.params.userId)
      .then(user => {
        if (!user) { return res.sendStatus(404); }

        return res.json({ user });
      })
      .catch(next);
  }
);

userRoutes.put('/:userId',
  (req: Request, res: Response, next: NextFunction) => {
    User.findById(req.params.userId)
      .then(user => {
        if (!user) { return res.sendStatus(404); }
        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
          user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
          user.email = req.body.user.email;
        }

        return user.save().then(function () {
          return res.json({ user });
        });
      })
      .catch(next);
  }
);

export default userRoutes;
