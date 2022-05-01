import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmailForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email()
    ])
  })

  public messages = {
    'email.required': 'O campo e-mail é obrigatório',
    'email.email': 'O campo e-mail deve ser um e-mail válido'
  }
}
