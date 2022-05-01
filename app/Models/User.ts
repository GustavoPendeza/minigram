import Hash from '@ioc:Adonis/Core/Hash';
import Env from '@ioc:Adonis/Core/Env';
import Route from '@ioc:Adonis/Core/Route';
import Mail from '@ioc:Adonis/Addons/Mail'
import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post';
import Follow from './Follow';
import ForgotPassword from './ForgotPassword';
import Like from './Like';
import Category from './Category';
import Save from './Save';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatar: string
  
  @column()
  public description: string

  @column.dateTime()
  public email_verified_at: DateTime

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Follow)
  public follows: HasMany<typeof Follow>

  @hasMany(() => ForgotPassword)
  public forgot: HasMany<typeof ForgotPassword>

  @hasMany(() => Like)
  public like: HasMany<typeof Like>

  @hasMany(() => Category)
  public category: HasMany<typeof Category>

  @hasMany(() => Save)
  public salvar: HasMany<typeof Save>

  /**
   * Retorna todos o usuário está seguindo
   * 
   * @returns Array<User>
   */
  public async followings() {
    const followings = await User.query().join('follows', 'users.id', '=', 'follows.following_id').select('users.*').where('user_id', this.id)

    return followings
  }

  /**
   * Retorna todos os seguidores do usuário
   * 
   * @returns Array<User>
   */
  public async followers() {
    const followers = await User.query().join('follows', 'users.id', '=', 'follows.user_id').select('users.*').where('following_id', this.id)

    return followers
  }

  /**
   * Envia um e-mail de verificação de e-mail
   */
  public async sendEmailVerification() {
    const url = Env.get('APP_URL') + Route.makeSignedUrl('verifyEmail', { 
      params: { email: this.email }, 
      expiresIn: '30m' 
    })

    await Mail.send((message) => {
      message
      .from('naoresponder@adonisjs.com')
      .to(this.email)
      .subject('Verificação de e-mail')
      .htmlView('emails/verify', { user: this, url })
    })
  }

  /**
   * Envia um e-mail de alteração de senha
   * 
   * @param token um token em randomString de 40 caracteres
   */
  public async sendEmailForgotPassword(token) {
    const url = Env.get('APP_URL') + Route.makeSignedUrl('forgot.edit', { 
      token: token, 
      expiresIn: '30m' 
    })

    await Mail.send((message) => {
      message
      .from('naoresponder@adonisjs.com')
      .to(this.email)
      .subject('Solicitação de alteração de senha')
      .htmlView('emails/forgot', { user: this, url })
    })
  }

  /**
     * Busca todas as categorias do usuário autenticado e retorna o último post salvo em cada categoria
     * 
     * @returns allsaves - retorna o último post salvo(com ou sem categoria)
     * @returns categoryPost - retorna o último post salvo em cada categoria que o usuário autenticado tenha
     */
   public async allSaves() {
    // Busca o último Post salvo pelo usuário
    const allsaves = await Post.query().select('*')
        .join('saves', 'posts.id', '=', 'saves.post_id')
        .where('saves.user_id', this.id)
        .orderBy('saves.id', 'desc')
        .first()
    
    // Busca todas as categorias que o usuário tem criadas
    const categories = await Category.query().select('*')
        .where('categories.user_id', this.id)
        .orderBy('category')

    const categoryPost = []

    // Para cada categoria que o usuário tem, busca o último Post salvo na categoria
    for (let index = 0; index < categories.length; index++) {
        var post = await Save.query().select('*')
            .where('saves.user_id', this.id)
            .andWhere('category_id', categories[index].id)
            .preload('post')
            .preload('category')
            .orderBy('saves.id', 'desc')
            .first()

        // Se não ouver Posts salvos na categoria, ele guarda somente a categoria
        if (post === null) {
            //@ts-ignore
            categoryPost.push(categories[index])
        } else {
            //@ts-ignore
            categoryPost.push(post)
        }
    }
        
    return { allsaves, categoryPost }
}
}
