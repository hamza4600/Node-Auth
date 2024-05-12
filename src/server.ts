import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { connectRedisClient } from './cache/redis';
import { TechnologyRoute } from './routes/tech.router';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute()]);
connectRedisClient(process.env.REDIS_URL);
app.listen();
