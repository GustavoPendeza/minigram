import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post';
import CreatePostValidator from 'App/Validators/CreatePostValidator'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator';

export default class PostsController {

    /**
     * Retorna a view de Criar Post
     * 
     * @param view ViewRendererContract
     * @returns View
     */
    public async create({ view }: HttpContextContract) {
        return view.render('posts/create')
    }

    /**
     * Cadastra um Post
     * 
     * @param auth AuthContract
     * @param request RequestContract
     * @param response ResponseContract 
     * @returns Response
     */
    public async store({ auth, request, response }: HttpContextContract) {
        await request.validate(CreatePostValidator)

        const image = request.file('image')
        // Muda o nome da imagem para guardar na pasta "image"
        const imageName = new Date().getTime().toString() + '_' + image?.clientName
        await image?.move(Application.publicPath('image'), {
            name: imageName
        })

        const post = new Post()

        post.image = `/image/${imageName}`
        post.caption = request.input('caption')
        post.userId = auth.user!.id
        
        await post.save()

        return response.redirect('/profile/' + auth.user!.username)
    }

    /**
     * Altera o campo "caption" do Post
     * 
     * @param auth AuthContract
     * @param params post.id
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract
     * @returns Response
     */
    public async update({ auth, params, request, response, session }: HttpContextContract) {
        await request.validate(UpdatePostValidator)

        const post = await Post.findOrFail(params.id)

        // Verifica se o usuário autenticado é o dono do Post
        if (post.userId !== auth.user!.id) {
            session.flash('formd', 'Você não possui permissão para alterar a legenda desse post')
            return response.redirect().back()
        }
        
        post.caption = request.input('caption')

        post.save()

        return response.redirect().back()
    }

    /**
     * Deleta um Post
     * 
     * @param auth AuthContract
     * @param params post.id
     * @param response ResponseContract
     * @param session SessionContract
     * @returns Response
     */
    public async destroy({ auth, params, response, session }) {
        const post = await Post.findOrFail(params.id)

        // Verifica se o usuário autenticado é o dono do Post
        if (post.userId !== auth.user!.id) {
            session.flash('formd', 'Você não possui permissão para deletar esse post')
            return response.redirect().back()
        }
        
        await post.delete()

        return response.redirect().back()
    }
}
