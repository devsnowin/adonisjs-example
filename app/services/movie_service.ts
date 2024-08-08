import Movie from '#models/movie'
import User from '#models/user'
import { movieFilterValidator } from '#validators/movie'
import { Infer } from '@vinejs/vine/types'

type MovieSortOption = {
  id: string
  text: string
  field: string
  dir: 'asc' | 'desc' | undefined
}

export default class MovieService {
  static sortOptions: MovieSortOption[] = [
    {
      id: 'title_asc',
      text: 'Title (asc)',
      field: 'title',
      dir: 'asc',
    },
    {
      id: 'title_desc',
      text: 'Title (desc)',
      field: 'title',
      dir: 'desc',
    },
    {
      id: 'releasedAt_desc',
      text: 'Released At (desc)',
      field: 'releasedAt',
      dir: 'desc',
    },
    {
      id: 'releasedAt_asc',
      text: 'Released At (asc)',
      field: 'releasedAt',
      dir: 'asc',
    },
    {
      id: 'writer_asc',
      text: 'Writer (asc)',
      field: 'cineasts.last_name',
      dir: 'asc',
    },
    {
      id: 'writer_desc',
      text: 'Writer (desc)',
      field: 'cineasts.last_name',
      dir: 'desc',
    },
  ]

  static getFiltered(
    filters: Infer<typeof movieFilterValidator>,
    user: User | undefined = undefined
  ) {
    const sort =
      this.sortOptions.find((option) => option.id === filters.sort) || this.sortOptions[0]

    return Movie.query()
      .if(filters.search, (query) => query.whereILike('title', `%${filters.search}%`))
      .if(filters.status, (query) => query.where('statusId', filters.status!))
      .if(['writer_asc', 'writer_desc'].includes(sort.id), (query) => {
        query.join('cineasts', 'cineasts.id', 'writer_id').select('movies.*')
      })
      .if(user, (query) =>
        query.preload('watchlist', (watchlist) => watchlist.where('userId', user!.id))
      )
      .preload('director')
      .preload('writer')
      .preload('status')
      .orderBy(sort.field, sort.dir)
  }
}
