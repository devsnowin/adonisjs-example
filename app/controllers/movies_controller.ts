import type { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import querystring from 'node:querystring'

import Movie from '#models/movie'
import MovieStatus from '#models/movie_status'
import MovieService from '#services/movie_service'
import { movieFilterValidator } from '#validators/movie'

export default class MoviesController {
  async index({ request, view, auth }: HttpContext) {
    const page = request.input('page', 1)
    const filters = await movieFilterValidator.validate(request.qs())
    const qs = querystring.stringify(filters)

    const movieSortOptions = MovieService.sortOptions
    const movies = await MovieService.getFiltered(filters, auth.user).paginate(page, 15)
    const movieStatuses = await MovieStatus.query().orderBy('name').select('id', 'name')

    movies.baseUrl(router.makeUrl('movies.index'))

    const rangeMin = movies.currentPage - 3
    const rangeMax = movies.currentPage + 3
    let pagination = movies.getUrlsForRange(1, movies.lastPage).filter((item) => {
      return item.page >= rangeMin && item.page <= rangeMax
    })

    if (qs) {
      pagination = pagination.map((item) => {
        item.url += `&${qs}`
        return item
      })
    }

    return view.render('pages/movies/index', {
      movies,
      filters,
      movieStatuses,
      movieSortOptions,
      pagination,
      qs,
    })
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
