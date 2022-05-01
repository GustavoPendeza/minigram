import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserRegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, []),
    username: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true })
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true })
    ]),
    password: schema.string({ trim: true }, [
      //rules.confirmed(),
      rules.minLength(6)
    ])
  })

  public messages = {
    'name.required': 'O campo nome é obrigatório',
    'username.required': 'O campo nome de usuário é obrigatório',
    'username.unique': 'Esse nome de usuário já está sendo utilizado',
    'email.required': 'O campo e-mail é obrigatório',
    'email.unique': 'Esse e-mail já está sendo utilizado',
    'password.required': 'O campo senha é obrigatório',
    //'password.confirmed': 'Os campos senha e confirmar senha devem ser iguais',
    'password.minLength': 'O campo senha deve ter no mínimo 6 caracteres'
  }
}
