import type { HttpContext } from '@adonisjs/core/http'

import Movie from '#models/movie'

export default class MoviesController {
  async index({ view }: HttpContext) {
    const movies = await Movie.all()
    return view.render('pages/movies/index', { movies })
  }

  async show({ params, view }: HttpContext) {
    const movie = await Movie.findByOrFail('slug', params.slug)
    return view.render('pages/movies/show', {
      movie,
    })
  }
}
