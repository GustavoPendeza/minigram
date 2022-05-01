import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Save from 'App/Models/Save'

export default class SavesController {

    /**
     * Retorna a view de Posts Salvos
     * 
     * @param auth AuthContract
     * @param params category.id
     * @param response ResponseContract
     * @param session SessionContract
     * @param view ViewRendererContract 
     * @returns View
     */
    public async index({ auth, params, response, session, view }: HttpContextContract) {
        
        await auth.user!.load('like')
        
        await auth.user!.load('follows')

        await auth.user!.load('salvar')

        // Se o parâmetro de categoria for "all" retorna todos os posts salvos pelo usuário, não importando a categoria
        if (params.category == 'all') {
            const category = 'Todos'

            const saves = await Save.query().select('*')
            .join('posts', 'saves.post_id', '=', 'posts.id')
            .join('users', 'posts.user_id', '=', 'users.id')
            .where('saves.user_id', auth.user!.id)
            .preload('post')
            .preload('user')
            .orderBy('saves.id', 'desc')

            return view.render('account/saves', { saves, category })
        }

        const category = await Category.query().select('*').where('id', params.category).first()
        
        // Se o usuário autenticado não for dono da categoria não poderá acessar essa página
        if (auth.user!.id != category!.userId) {
            session.flash('formd', 'Você não tem acesso a essa página')
            return response.redirect().back()
        }

        const saves = await Save.query().select('*')
            .join('categories', 'saves.category_id', '=', 'categories.id')
            .join('posts', 'saves.post_id', '=', 'posts.id')
            .join('users', 'posts.user_id', '=', 'users.id')
            .where('saves.user_id', auth.user!.id)
            .andWhere('categories.id', params.category)
            .preload('post')
            .preload('user')
            .preload('category')
            .orderBy('saves.id', 'desc')
            
        return view.render('account/saves', { saves, category })
    }

    /**
     * Cadastra um Post como "salvo" sem categoria
     * 
     * @param auth AuthContract
     * @param params post.id
     * @param response ResponseContract
     * @returns Response
     */
    public async store({ auth, params, response }: HttpContextContract) {
        const save = new Save()
        save.userId = auth.user!.id
        save.postId = params.postId
        //@ts-ignore
        save.categoryId = null
        await save.save()

        return response.redirect().back()
    }
    
    /**
     * Deleta um Post dos "Salvos" pelo usuário
     * 
     * @param auth AuthContract
     * @param params post.id
     * @param response ResponseContract
     * @returns Response
     */
    public async destroy({ auth, params, response }: HttpContextContract) {
        const save = Save.query().where('user_id', auth.user!.id).andWhere('post_id', params.postId)

        await save.delete()
        
        return response.redirect().back()
    }

}
