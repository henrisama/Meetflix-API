import Redis from "ioredis";
import { promisify } from "util";

class Cache {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      port: process.env.REDIS_PORT
        ? Number.parseInt(process.env.REDIS_PORT)
        : 6379,
      host: process.env.REDIS_HOST || "127.0.0.1",
      password: process.env.REDIS_PASSWORD || "",
    });
  }

  async get(value: string) {
    const syncRedisGet = promisify(this.redis.get).bind(this.redis);
    return syncRedisGet(value);
  }

  set(key: string, value: string) {
    const syncRedisSet = promisify(this.redis.set).bind(this.redis);
    return syncRedisSet(key, value);
  }

  del(key: string) {
    return this.redis.del(key);
    /* const syncRedisDel = promisify(this.redis.del).bind(this.redis);
    return syncRedisDel(key); */
  }
}

export default new Cache();
