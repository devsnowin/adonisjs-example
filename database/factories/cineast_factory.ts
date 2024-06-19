import factory from '@adonisjs/lucid/factories'
import Cineast from '#models/cineast'
import { MovieFactory } from './movie_factory.js'

export const CineastFactory = factory
  .define(Cineast, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      headshotUrl: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${faker.person.fullName()}`,
    }
  })
  .relation('moviesDirected', () => MovieFactory)
  .relation('moviesWritten', () => MovieFactory)
  .build()
