import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URI });
const DEFAULT_TTL = 60 * 60 * 24; // 1 day

function getOrSetCache(key, callback) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data) {
        return resolve(JSON.parse(data));
      }
      const result = await callback();
      await redisClient.set(key, JSON.stringify(result), 'EX', DEFAULT_TTL);
      return resolve(result);
    });
  });
}
export {
  redisClient,
  getOrSetCache,
  DEFAULT_TTL,
};
