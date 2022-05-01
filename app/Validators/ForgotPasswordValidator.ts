import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({ trim: true }, [
      //rules.confirmed(),
      rules.minLength(6)
    ])
  })

  public messages = {
    'password.required': 'O campo senha é obrigatório',
    //'password.confirmed': 'Os campos senha e confirmar senha devem ser iguais',
    'password.minLength': 'O campo senha deve ter no mínimo 6 caracteres'
  }
}
