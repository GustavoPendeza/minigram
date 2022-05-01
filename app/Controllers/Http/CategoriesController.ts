import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Save from 'App/Models/Save'
import User from 'App/Models/User'
import CategoryValidator from 'App/Validators/CategoryValidator'

export default class CategoriesController {

    /**
     * Retorna a view de categorias dos posts salvos
     * 
     * @param auth AuthContract
     * @param view ViewRendererContract
     * @returns View
     */
    public async index({ auth, view }: HttpContextContract) {
        const user = await User.findBy('id', auth.user!.id)

        const { allsaves, categoryPost } = await user!.allSaves()
        
        return view.render('account/categories', { allsaves, categoryPost })
    }

    /**
     * Cadastra uma nova categoria de salvar post(Salva o post na categoria criada, se ouver algum)
     * 
     * @param auth AuthContract
     * @param request RequestContract
     * @param response ResponseContract
     * @returns Response
     */
    public async create({ auth, request, response }: HttpContextContract) {
        await request.validate(CategoryValidator)
        
        const user = auth.user!.id

        const category = new Category()
        category.userId = user
        category.category = request.input('category')
        await category.save()

        // Se estiver criando a categoria por um Post, ele salva o Post na categoria criada
        if (request.input('post')) {
            const save = new Save()
            save.userId = user
            save.postId = request.input('post')
            save.categoryId = category.id
            await save.save()
        }

        return response.redirect().back()
    }

    /**
     * Salva um post em uma categoria já criada
     * 
     * @param auth AuthContract
     * @param params postId
     * @param request RequestContract
     * @param response ResponseContract
     * @returns Response
     */
    public async store({ auth, params, request, response }: HttpContextContract) {
        const save = new Save()
        save.userId = auth.user!.id
        save.postId = params.postId
        save.categoryId = request.input('category')
        await save.save()

        return response.redirect().back()
    }
    
    /**
     * Altera o nome de uma categoria
     * 
     * @param auth AuthContract
     * @param params category.id
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract
     * @returns Response
     */
    public async update({ auth, params, request, response, session }: HttpContextContract) {
        await request.validate(CategoryValidator)

        const category = await Category.findOrFail(params.id)

        if (category.userId !== auth.user!.id) {
            session.flash('formd', 'Você não possui permissão para alterar o nome dessa categoria')
            return response.redirect().back()
        }

        category.category = request.input('category')

        category.save()

        return response.redirect().back()
    }

    /**
     * Deleta uma categoria
     * 
     * @param auth AuthContract
     * @param params category.id
     * @param response ResponseContract
     * @param session SessionContract
     * @returns Response
     */
    public async destroy({ auth, params, response, session }: HttpContextContract) {
        const category = await Category.findOrFail(params.id)

        if (category.userId !== auth.user!.id) {
            session.flash('formd', 'Você não possui permissão para deletar essa categoria')
            return response.redirect().back()
        }

        await category.delete()
        
        return response.redirect('/save/categories')
    }

}
