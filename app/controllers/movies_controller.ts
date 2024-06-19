import type { HttpContext } from '@adonisjs/core/http'

import Movie from '#models/movie'

export default class MoviesController {
  async index({ view }: HttpContext) {
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
    return view.render('pages/movies/index', { recentlyReleasedMovies, comingSoonMovies })
  }

  async show({ params, view }: HttpContext) {
    const movie = await Movie.findByOrFail('slug', params.slug)

    await movie.load('director')
    await movie.load('writer')
    await movie.load('status')

    return view.render('pages/movies/show', { movie })
  }
}
