import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    image: schema.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
    caption: schema.string({ trim: true, escape: true }, [
      rules.maxLength(200)
    ]),
  })

  public messages = {
    'image.required': 'A imagem é obrigatória',
    'file.size': 'Sua imagem deve ter menos de 2mb',
    'file.extname': 'Sua imagem deve ser: jpg, jpeg ou png',
    'caption.required': 'A legenda da imagem é obrigatória',
    'caption.maxLength': 'Sua legenda deve ter no máximo 200 caracteres'
  }
}
