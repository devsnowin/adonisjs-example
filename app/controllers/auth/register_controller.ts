import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatarUrl: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${data.fullName}`,
    })

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
}
