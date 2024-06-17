import { toHtml } from '@dimerapp/markdown/utils'
import { DateTime } from 'luxon'

import MovieService from '#services/movie_service'
import cache from '#services/cache_service'

export default class Movie {
  declare id: number

  declare title: string

  declare slug: string

  declare summary: string

  declare content: string

  declare released: string

  declare director: string

  declare createdAt: DateTime

  declare updatedAt: DateTime

  static async findAll() {
    const slugs = await MovieService.getSlugs()
    const movies: Movie[] = []

    for (const slug of slugs) {
      const md = await MovieService.read(slug)
      const movie = await this.find(slug)
      movie.slug = slug
      movie.title = md.frontmatter.title
      movie.summary = md.frontmatter.summary
      movie.director = md.frontmatter.director
      movie.released = md.frontmatter.released
      movies.push(movie)
    }

    return movies
  }

  static async find(slug: string) {
    if (await cache.hash(slug)) {
      console.log(`Cache Hit: ${slug}`)
      return cache.get(slug)
    }

    const md = await MovieService.read(slug)

    const movie = new Movie()
    movie.slug = slug
    movie.title = md.frontmatter.title
    movie.summary = md.frontmatter.summary
    movie.director = md.frontmatter.director
    movie.released = md.frontmatter.released
    movie.content = toHtml(md).contents

    // cache the movie
    await cache.set(slug, movie)

    return movie
  }
}
