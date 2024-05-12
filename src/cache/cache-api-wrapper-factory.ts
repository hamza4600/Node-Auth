import { CacheAPIWrapper } from './cache-api-wrapper';
import { RedisCacheAPIWrapper } from './redis-cache-api-wrapper';
import { connectRedisClient } from './redis/connect-redis-client';

export const createCacheAPIWrapperAsync = async <TEntity extends { [k: string]: number | string | null }, TUniqueKey extends keyof TEntity = 'id'>(
  cacheKeyPrefix: string,
): Promise<CacheAPIWrapper<TEntity, TUniqueKey> | null> => {
  try {
    const REDIS_URL = process.env.REDIS_URL;
    if (!REDIS_URL) {
      console.error('[Invalid environment] Variable not found: REDIS_URL');
      throw new Error('[Invalid environment] Variable not found: REDIS_URL');
    }

    const REDIS_CACHE_TTL_SECONDS_STRING = process.env.REDIS_CACHE_TTL_SECONDS;
    const REDIS_CACHE_TTL_SECONDS = Number(REDIS_CACHE_TTL_SECONDS_STRING);
    if (REDIS_CACHE_TTL_SECONDS_STRING && isNaN(REDIS_CACHE_TTL_SECONDS)) {
      console.error('[Invalid environment] Invalid variable: REDIS_CACHE_TTL_SECONDS. Should be a number');
      throw new Error('[Invalid environment] Invalid variable: REDIS_CACHE_TTL_SECONDS. Should be a number');
    }
    const redisClient = await connectRedisClient(REDIS_URL);
    return redisClient ? new RedisCacheAPIWrapper(redisClient, cacheKeyPrefix, REDIS_CACHE_TTL_SECONDS) : null;
  } catch (error) {
    console.error('Cannot create cache API wrapper.', error);
    return null;
  }
};
