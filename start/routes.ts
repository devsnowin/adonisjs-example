import router from '@adonisjs/core/services/router'

import { middleware } from './kernel.js'

const LogoutController = () => import('#controllers/auth/logout_controller')
const HomeController = () => import('#controllers/home_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const WritersController = () => import('#controllers/writers_controller')
const DirectorsController = () => import('#controllers/directors_controller')
const RedisController = () => import('#controllers/redis_controller')
const MoviesController = () => import('#controllers/movies_controller')

// Home
router.get('/', [HomeController, 'show']).as('home')

// Auth
router
  .group(() => {
    router
      .get('/register', [RegisterController, 'show'])
      .as('register.show')
      .use(middleware.guest())
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())

    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('/auth')
  .as('auth')

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

// Private Page
router
  .group(() => {
    router.on('/dashboard').render('pages/dashboard').as('dashboard')
    router.on('/profile').render('pages/profile/index').as('profile.index')
  })
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/', async () => {
        return 'Admin route!'
      })
      .as('index')
  })
  .prefix('/admin')
  .as('admin')
  .use(middleware.admin())
