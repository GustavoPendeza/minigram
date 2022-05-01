import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    category: schema.string({ trim: true }, [
      rules.maxLength(50)
    ])
  })

  public messages = {
    'category.required': 'O campo categoria é obrigatório',
    'category.maxLength': 'O campo categoria deve ter no máximo 50 caracteres'
  }
}
