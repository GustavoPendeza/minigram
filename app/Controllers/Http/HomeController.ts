import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import User from 'App/Models/User'

export default class HomeController {
    
    /**
     * Retorna a view da página Home
     * 
     * @param auth AuthContract
     * @param view ViewRendererContract 
     * @returns View
     */
    public async index({ auth, view }: HttpContextContract) {
        const user = await User.findBy('id', auth.user!.id)
        
        await auth.user!.load('follows')
        const follows = auth.user!.follows.map(f => f.followingId)
        const userIds = [auth.user!.id, ... follows ?? []]

        await auth.user!.load('like')

        await auth.user!.load('salvar')
        
        const posts = await Post.query().whereIn('userId', userIds).preload('user').orderBy('created_at', 'desc')

        const recommendations = await User.query().select('*').whereNotIn('id', userIds).orderByRaw('RAND()').limit(6)

        const { allsaves, categoryPost } = await user!.allSaves()
        
        return view.render('index', { posts, recommendations, allsaves, categoryPost })
    }
    
}
