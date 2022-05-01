import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    caption: schema.string({ trim: true, escape: true }, [
      rules.maxLength(200)
    ]),
  })

  public messages = {
    'caption.required': 'A legenda da imagem é obrigatória',
    'caption.maxLength': 'Sua legenda deve ter no máximo 200 caracteres'
  }
}
