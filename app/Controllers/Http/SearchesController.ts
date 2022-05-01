import User from 'App/Models/User';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SearchesController {

    /**
     * Retorna a view da página "Pesquisar" com os resultados da pesquisa
     * 
     * @param auth AuthContract
     * @param request RequestContract
     * @param view ViewRendererContract
     * @returns View
     */
    public async index({ auth, request, view }: HttpContextContract) {
        const pesquisa = request.input('pesquisar')

        const page = request.input('page', 1)
        const limit = 10

        const resultados = await User.query().select('*')
            .whereRaw(`name LIKE '%${pesquisa}%'`)
            .orWhereRaw(`username LIKE '%${pesquisa}%'`).orderBy('username')
            .paginate(page, limit)

        await auth.user!.load('follows')

        resultados.baseUrl(`/search?pesquisar=${pesquisa}&`)

        return view.render('search', { resultados, pesquisa, page })
    }
}
