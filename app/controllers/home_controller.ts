import Movie from '#models/movie'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ view }: HttpContext) {
    return view.render('pages/home/index')
  }

  async show({ view }: HttpContext) {
    const comingSoonMovies = await Movie.query()
      .apply((scope) => scope.notReleased())
      .preload('director')
      .preload('writer')
      .whereNotNull('releasedAt')
      .orderBy('releasedAt', 'desc')
      .limit(3)
    const recentlyReleasedMovies = await Movie.query()
      .apply((scope) => scope.released())
      .preload('director')
      .preload('writer')
      .orderBy('releasedAt', 'desc')
      .limit(9)
    return view.render('pages/home/show', { recentlyReleasedMovies, comingSoonMovies })
  }
}
