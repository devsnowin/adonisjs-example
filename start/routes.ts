import router from '@adonisjs/core/services/router'

import { middleware } from './kernel.js'

const WritersController = () => import('#controllers/writers_controller')
const DirectorsController = () => import('#controllers/directors_controller')
const RedisController = () => import('#controllers/redis_controller')
const MoviesController = () => import('#controllers/movies_controller')

// Home
router.on('/').render('pages/home').as('home')

// Auth
router.on('/login').render('pages/auth/login').as('login')

// Private Page
router.on('/dashboard').render('pages/dashboard').as('dashboard').use(middleware.auth())

// Movies
router.get('/movies', [MoviesController, 'index']).as('movies.index')
router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', router.matchers.slug())

// Cineasts
router.get('/directors', [DirectorsController, 'index']).as('directors.index')
router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

router.get('/writers', [WritersController, 'index']).as('writers.index')
router.get('/writers/:id', [WritersController, 'show']).as('writers.show')

// Redis flush & delete
router.delete('/redis/flush', [RedisController, 'flush']).as('redis.flush')
router.delete('/redis/:slug', [RedisController, 'destory']).as('redis.delete')
