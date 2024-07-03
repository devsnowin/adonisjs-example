import type { HttpContext } from '@adonisjs/core/http'

import Movie from '#models/movie'

export default class MoviesController {
  async index({ view }: HttpContext) {
    const movies = await Movie.query()
      .preload('director')
      .preload('writer')
      .orderBy('title')
      .limit(15)

    return view.render('pages/movies/index', { movies })
  }

  async show({ params, view }: HttpContext) {
    const movie = await Movie.findByOrFail('slug', params.slug)
    const cast = await movie.related('castMembers').query().orderBy('pivot_sort_order')
    const crew = await movie
      .related('crewMembers')
      .query()
      .wherePivot('title', 'Sound Mixer')
      .orderBy('pivot_sort_order')

    await movie.load('director')
    await movie.load('writer')
    await movie.load('status')

    return view.render('pages/movies/show', { movie, cast, crew })
  }
}
