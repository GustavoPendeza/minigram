import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserRegisterValidator from 'App/Validators/UserRegisterValidator'

export default class AuthController {

    /**
     * Retorna a view de cadastrar usuário
     * 
     * @param view ViewRendererContract
     * @returns View
     */
    public async registerShow({ view }: HttpContextContract) {
        return view.render('auth/register')
    }
    
    /**
     * Cadastra um usuário, envia um e-mail de verificação e faz o login do mesmo
     * 
     * @param auth AuthContract
     * @param request ResquestContract
     * @param response ResponseContract 
     * @returns Response
     */
    public async register({ auth, request, response  }: HttpContextContract) {
        const data = await request.validate(UserRegisterValidator)

        data.username = data.username.toLowerCase()

        const user = await User.create(data)

        // Manda verificação de email
        user.sendEmailVerification()

        await auth.login(user)

        return response.redirect('/')
    }

    /**
     * Retorna a view de login
     * 
     * @param view ViewRendererContract 
     * @returns View
     */
    public async loginShow({ view }: HttpContextContract) {
        return view.render('auth/login')
    }

    /**
     * Faz o login do usuário
     * 
     * @param auth AuthContract
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract 
     * @returns Response
     */
    public async login({ auth, request, response, session }: HttpContextContract) {
        const { uid, password } = request.only(['uid', 'password'])

        try {
            await auth.attempt(uid, password)
        } catch (error) {
            session.flash('formd', 'Seu nome de usuário, e-mail e/ou senha estão incorretos')
            return response.redirect().back()
        }

        return response.redirect('/')
        
    }

    /**
     * Faz o logout do usuário
     * 
     * @param auth AuthContract
     * @param response ResponseContract
     * @returns Response
     */
    public async logout({ auth, response }: HttpContextContract) {
        await auth.logout()

        return response.redirect().toRoute('auth.login.show')
    }
}
