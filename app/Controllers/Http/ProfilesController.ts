import Application from '@ioc:Adonis/Core/Application';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ProfileUpdateValidator from 'App/Validators/ProfileUpdateValidator';

export default class ProfilesController {
    
    /**
     * Retorna a view de Profile
     * 
     * @param auth AuthContract
     * @param params user.username
     * @param view ViewRendererContract
     * @returns View
     */
    public async index({ auth, params, view }: HttpContextContract) {
        const username = params.username
        const user = await User.findBy('username', username)

        // Verifica se o usuário existe
        if(!user) {
            return view.render('errors/not-found')
        }

        // Pega os Posts do usuário
        await user.load('posts', (postQuery) => {
            postQuery.orderBy('id', 'desc')
        })

        // Verifica se o usuário está seguindo o perfil visitado
        await auth.user!.load('follows')

        // Busca as pessoas que o usuário segue
        const followings = await user.followings()

        // Busca os seguidores que o usuário tem
        const followers = await user.followers()

        await auth.user!.load('like')

        await auth.user!.load('salvar')

        const { allsaves, categoryPost } = await user!.allSaves()

        return view.render('profile', { user, followings, followers, allsaves, categoryPost })
    }

    /**
     * Retorna a view de "Editar Perfil"
     * 
     * @param auth AuthContract
     * @param view ViewRendererContract
     * @returns View
     */
    public async edit({ auth, view }: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)

        if (user.description === null) {
            user.description = ''
        }

        return view.render('account/edit', {
            user: user
        })
    }

    /**
     * Altera um usuário
     * 
     * @param auth AuthContract
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract 
     * @returns Response
     */
    public async update({ auth, request, response, session }: HttpContextContract) {
        const user = await User.findOrFail(auth.user!.id)
        await request.validate(ProfileUpdateValidator)
        const avatar = request.file('avatar')

        // Verifica se há uma nova imagem para "avatar"
        if (avatar) {
            const imageName = new Date().getTime().toString() + '_' + avatar.clientName
            await avatar.move(Application.publicPath('avatar'), {
                name: imageName
            })
            user.avatar = `/avatar/${imageName}`
        }

        // Verifica se o e-mail foi alterado
        // Caso seja alterado, o campo de verificação de e-mail se torna nulo e é enviado outro e-mail de verificação
        if (user.email !== request.input('email')) {
            user.email = request.input('email')
            //@ts-ignore
            user.email_verified_at = null
            user.sendEmailVerification()
            session.flash('forms', 'Um e-mail de confirmação foi enviado ao seu novo endereço de e-mail')
        }

        user.name = request.input('name')
        user.username = request.input('username')
        user.username = user.username.toLowerCase()
        user.description = request.input('description')

        await user.save()

        return response.redirect(`/profile/${auth.user!.username}`)
    }

}
