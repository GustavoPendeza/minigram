import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfileUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    tenantId: this.ctx.auth.user!.id
  })

  public schema = schema.create({
    name: schema.string({ trim: true }, []),
    username: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'username', caseInsensitive: true, whereNot: { id: this.refs.tenantId } })
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true, whereNot: { id: this.refs.tenantId } })
    ]),
    avatar: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    description: schema.string.optional({ trim: true, escape: true }, [
      rules.maxLength(100)
    ]),
  })

  public messages = {
    'name.required': 'O campo nome é obrigatório',
    'username.required': 'O campo nome de usuário é obrigatório',
    'username.unique': 'Esse nome de usuário já está sendo utilizado',
    'email.required': 'O campo e-mail é obrigatório',
    'email.unique': 'Esse e-mail já está sendo utilizado',
    'file.size': 'Sua foto de perfil deve ter menos de 2mb',
    'file.extname': 'Sua foto de perfil deve ser: jpg, jpeg ou png',
    'description.maxLength': 'Sua descrição deve ter no máximo 100 caracteres'
  }
}
