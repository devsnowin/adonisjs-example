import cache from '#services/cache_service'
import { HttpContext } from '@adonisjs/core/http'

export default class RedisController {
  async destory({ response, params }: HttpContext) {
    console.log({ slug: params.slug })

    await cache.delete(params.slug)
    return response.redirect().back()
  }
  async flush({ response }: HttpContext) {
    await cache.flushDB()
    return response.redirect().back()
  }
}
