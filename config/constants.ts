import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';
import env from "node-env-file";
env(__dirname + "/env/.env.development");
const { env: environment } = process;
config({ path: pathResolve(__dirname, `/env/.env.${ environment.NODE_ENV || 'development' }`) });

export default {
  environment: environment.NODE_ENV,
  port: Number(environment.PORT),
  mongoConnectionString: environment.MONGO_CONNECTION_STRING,
  SQL: {
    db: environment.SQL_DB,
    username: environment.SQL_USERNAME,
    password: environment.SQL_PASSWORD,
    host: environment.SQL_HOST,
    port: Number(environment.SQL_PORT),
    dialect: environment.SQL_DIALECT
  },
  AWS: {
    accessKeyId: environment.AWS_ACCESS_KEY_ID,
    secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    mainBucket: environment.AWS_MAINBUCKET
  },
  auth0: {
    domain: environment.AUTH0_DOMAIN,
    clientId: environment.AUTH0_CLIENT_ID,
    clientSecret: environment.AUTH0_CLIENT_SECRET,
    audience: environment.AUTH0_AUDIENCE
  },
  pubnub: {
    publishKey: environment.PUBNUB_PUBLISH_KEY,
    subscribeKey: environment.PUBNUB_SUBSCRIBE_KEY,
    secretKey: environment.PUBNUB_SECRET_KEY
  },
  errorTypes: {
    db: { statusCode: 500, name: 'Internal Server Error', message: 'database error' },
    validation: { statusCode: 400, name: 'Bad Request', message: 'validation error' },
    auth: { statusCode: 401, name: 'Unauthorized', message: 'auth error' },
    forbidden: { statusCode: 403, name: 'Forbidden', message: 'forbidden content' },
    notFound: { statusCode: 404, name: 'Not Found', message: 'content not found' },
    entity: { statusCode: 422, name: 'Unprocessable Entity', message: 'entity error' }
  },
  get errorMap() {
    return {
      ValidateError: this.errorTypes.validation,
      ValidationError: this.errorTypes.validation,
      CastError: this.errorTypes.db
    };
  }
};
