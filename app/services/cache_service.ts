import redis from '@adonisjs/redis/services/main'

class CacheService {
  async hash(...keys: string[]) {
    return await redis.exists(keys)
  }

  async get(key: string) {
    const value = await redis.get(key)
    return value && JSON.parse(value)
  }

  async set(key: string, value: any) {
    return redis.set(key, JSON.stringify(value))
  }

  async delete(...keys: string[]) {
    return redis.del(keys)
  }

  async flushDB() {
    return redis.flushdb()
  }
}

const cache = new CacheService()
export default cache
