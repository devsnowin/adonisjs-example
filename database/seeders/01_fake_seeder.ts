import { movies } from '#database/data/movies'
import { CineastFactory } from '#database/factories/cineast_factory'
import { MovieFactory } from '#database/factories/movie_factory'
import { UserFactory } from '#database/factories/user_factory'
import MovieStatuses from '#enums/movie_statuses'
import Cineast from '#models/cineast'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  static environment: string[] = ['development', 'test']

  async run() {
    const cineasts = await CineastFactory.createMany(10)
    await UserFactory.with('profile').createMany(5)
    await this.#createMovies(cineasts)
  }

  async #createMovies(cineasts: Cineast[]) {
    let index = 0
    await MovieFactory.tap((row, { faker }) => {
      const movie = movies[index]
      const released = DateTime.now().set({ year: movie.releaseYear })

      row.statusId = MovieStatuses.RELEASED
      row.title = movie.title
      row.directorId = cineasts.at(Math.floor(Math.random() * cineasts.length))!.id
      row.writerId = cineasts.at(Math.floor(Math.random() * cineasts.length))!.id
      row.releasedAt = DateTime.fromJSDate(
        faker.date.between({
          from: released.startOf('year').toJSDate(),
          to: released.endOf('year').toJSDate(),
        })
      )

      index++
    }).createMany(movies.length)

    await MovieFactory.with('director')
      .with('writer')
      .with('castMembers', 3, (builder) =>
        builder.pivotAttributes([
          { character_name: 'Robert', sort_order: 0 },
          { character_name: 'Jane', sort_order: 1 },
          { character_name: 'Joseph', sort_order: 2 },
        ])
      )
      .with('crewMembers', 5, (builder) =>
        builder.pivotAttributes({
          title: 'Camera Operator',
        })
      )
      .createMany(3)
    await MovieFactory.with('director').with('writer').apply('released').createMany(2)
    await MovieFactory.with('director').with('writer').apply('releasingSoon').createMany(2)
    await MovieFactory.with('director').with('writer').apply('postProduction').createMany(2)
  }
}
