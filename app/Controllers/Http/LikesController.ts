import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Like from 'App/Models/Like'
import User from 'App/Models/User'

export default class LikesController {

    /**
     * Retorna a view de Listagem de Posts que o usuário deu Like
     * 
     * @param auth AuthContract
     * @param view ViewRendererContract
     * @returns View
     */
    public async index({ auth, view }: HttpContextContract) {
        const likes = await Like.query()
            .join('posts', 'likes.post_id', '=', 'posts.id')
            .join('users', 'posts.user_id', '=', 'users.id')
            .where('likes.user_id', auth.user!.id)
            .preload('post')
            .preload('user')
            .orderBy('likes.created_at', 'desc')
        
        await auth.user!.load('like')
        
        await auth.user!.load('follows')

        await auth.user!.load('salvar')

        const user = await User.findBy('id', auth.user!.id)

        const { allsaves, categoryPost } = await user!.allSaves()
        
        return view.render('account/likes', { likes, allsaves, categoryPost })
    }

    /**
     * Cadastra o Like de um usuário em um Post
     * 
     * @param auth AuthContract
     * @param params post.id
     * @param response ResponseContract 
     * @returns Response
     */
    public async store({ auth, params, response }: HttpContextContract) {
        const like = new Like()

        like.userId = auth.user!.id
        like.postId = params.postId

        await like.save()

        return response.redirect().back()
    }

    /**
     * Deleta um Like
     * 
     * @param auth AuthContract
     * @param params post.id
     * @param response ResponseContract 
     * @returns Response
     */
    public async destroy({ auth, params, response }) {
        const like = Like.query().where('user_id', auth.user.id).andWhere('post_id', params.postId)
        
        await like.delete()

        return response.redirect().back()
    }
}
