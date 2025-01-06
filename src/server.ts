import { App } from './app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { connectRedisClient } from './cache/redis';
import { TechnologyRoute } from './routes/tech.router';
import { CaseRoute } from './routes/case.route';

try {
ValidateEnv();

const app = new App([new UserRoute()]);
  console.log(process.env.NODE_ENV);
  console.log('App is running');
  // connectRedisClient(process.env.REDIS_URL);
  app.listen();
} catch (error) {
  console.error(error);
}

