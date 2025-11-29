const redis = require("redis");

let redisClient = null;

const connectRedis = async () => {
  try {
    // Support both Upstash Redis URL and traditional Redis config
    const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;
    
    if (redisUrl) {
      // Use URL-based connection (Upstash)
      redisClient = redis.createClient({
        url: redisUrl,
      });
    } else {
      // Use traditional host/port config
      redisClient = redis.createClient({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      });
    }

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
      redisClient = null;
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    await redisClient.connect();
  } catch (error) {
    console.error("Redis connection failed:", error.message);
    console.log("⚠️ Redis disabled - app will work without caching");
    redisClient = null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
};

const cacheSet = async (key, value, expiry = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.setEx(key, expiry, JSON.stringify(value));
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

const cacheDelete = async (key) => {
  if (!redisClient) return;
  try {
    // Handle wildcard patterns
    if (key.includes('*')) {
      const keys = await redisClient.keys(key);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`🗑️ Cleared ${keys.length} cache keys matching: ${key}`);
      }
    } else {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error("Cache delete error:", error);
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  cacheGet,
  cacheSet,
  cacheDelete,
};
