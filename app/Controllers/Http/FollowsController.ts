import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Follow from 'App/Models/Follow'

export default class FollowsController {
    
    /**
     * Cadastra o usuário autenticado como "seguindo" um outro usuário
     * 
     * @param auth AuthContract
     * @param params postId
     * @param request RequestContract
     * @param response ResponseContract
     * @returns Response
     */
    public async store({ auth, params, request, response }: HttpContextContract) {
        const follow = new Follow()

        follow.userId = auth.user!.id
        follow.followingId = params.id

        await follow.save()

        // Verifica se o cadastro está sendo feito pela página de "pesquisar"
        if (request.input('pesquisar') && request.input('page')) {
            const pesquisa = request.input('pesquisar')
            const page = request.input('page')
            return response.redirect(`/search?pesquisar=${pesquisa}&page=${page}`)
        }

        return response.redirect().back()
    }

    /**
     * O usuário autenticado para de seguir um outro usuário
     * 
     * @param auth AuthContract
     * @param params postId
     * @param request RequestContract
     * @param response ResponseContract
     * @returns Response
     */
    public async destroy({ auth, params, request, response }) {
        const follow = Follow.query().where('user_id', auth.user.id).where('following_id', params.id)
        
        await follow.delete()

        // Verifica se está sendo feito pela página de "pesquisar"
        if (request.input('pesquisar') && request.input('page')) {
            const pesquisa = request.input('pesquisar')
            const page = request.input('page')
            return response.redirect(`/search?pesquisar=${pesquisa}&page=${page}`)
        }

        return response.redirect().back()
    }
    
}
