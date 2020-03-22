import path from 'path';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import errorHandler from 'errorhandler';
import mongoose from 'mongoose';
import morgan from "morgan";
import methodOverride from "method-override"
import { urlencoded, json } from 'body-parser';
import { config } from 'dotenv';

import constants from './config/constants';
const setting = constants.environment
const isProduction: boolean = constants.environment !== 'production';
// Create global app object
const app: express.Application = express();

app.use(cors());

// Normal express config defaults
app.use(morgan('dev'));
app.use(urlencoded({ extended: false }));
app.use(json());

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'conduit',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));

if (!isProduction) {
  app.use(errorHandler());
}

if (isProduction) {
  mongoose.connect(constants.mongoConnectionString);
} else {
  mongoose.connect('mongodb://localhost/kuro');
  mongoose.set('debug', true);
}

require('./models/User');
// require('./models/Article');
// require('./models/Comment');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  let err = new Error('Not Found');
  // TODO: add status
  // err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(constants.port || 1337, () => {
  console.log('Listening on port ' + constants.port);
});
