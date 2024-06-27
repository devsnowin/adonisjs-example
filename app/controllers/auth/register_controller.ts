import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])

    const user = await User.create(data)

    return response.redirect().toRoute('home')
  }
}
