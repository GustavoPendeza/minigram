import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForgotPassword from 'App/Models/ForgotPassword';
import User from 'App/Models/User'
import EmailForgotPasswordValidator from 'App/Validators/EmailForgotPasswordValidator'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator';
var randomstring = require('randomstring')

export default class ForgotPasswordsController {
    /**
     * Retorna a view de "esqueci minha senha"
     * 
     * @param view ViewRendererContract
     * @returns View
     */
    public async index({ view }: HttpContextContract) {
        return view.render('auth/forgot')
    }
    
    /**
     * Cadastra um token de verificação e envia um e-mail para alterar senha
     * 
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract
     * @returns Response
     */
    public async store({ request, response, session }: HttpContextContract) {
        await request.validate(EmailForgotPasswordValidator)
        const email = request.input('email')
        const user = await User.query().where('email', email).first()
        
        // Verifica se há algum usuário com esse e-mail
        if (!user) {
            session.flash('form', 'O e-mail que você digitou não está cadastrado')
            return response.redirect().back()
        }

        // Gera um token de 40 caracteres aleatórios
        const token = await randomstring.generate(40)

        const forgot = new ForgotPassword()
        forgot.userId = user.id
        forgot.token = token
        forgot.used = false

        await forgot.save()

        user.sendEmailForgotPassword(token)

        session.flash('forms', 'O e-mail para alterar senha foi enviado com sucesso')
        return response.redirect('/login')
    }

    /**
     * Retorna a view de alteração de senha
     * 
     * @param params token 
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract
     * @param view ViewRendererContract
     * @returns View
     */
    public async edit({ params, request, response, session, view }: HttpContextContract) {
        const forgotObject = await ForgotPassword.query().where('token', params.token).orderBy('id', 'desc').first()

        // Verifica se existe um cadastro do token que foi passado e se já foi utilizado
        if (!forgotObject) {
            session.flash('formd', 'O link que você tentou utilizar não existe')
            return response.redirect('/login')
        } else if(forgotObject.used == true) {
            session.flash('formd', 'O link que você tentou utilizar já foi utilizado')
            return response.redirect('/login')
        }

        // Verifica se o token passado não expirou (30 min de validade)
        if (request.hasValidSignature()) {
            return view.render('auth.edit', { token: params.token })
        } else {
            session.flash('formd', 'O link que você tentou utilizar já expirou')
            return response.redirect('/login')
        }
    }

    /**
     * Altera a senha do usuário
     * 
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract
     * @returns Response
     */
    public async update({ request, response, session }: HttpContextContract) {
        await request.validate(ForgotPasswordValidator)
        const forgotObject = await ForgotPassword.query().where('token', request.input('token')).orderBy('id', 'desc').first()

        // Verifica se existe um cadastro do token que foi passado
        if (!forgotObject) {
            session.flash('formd', 'O link que você tentou utilizar não existe')
            return response.redirect('/login')
        } else if(forgotObject.used == true) {
            session.flash('formd', 'O link que você tentou utilizar já foi utilizado')
            return response.redirect('/login')
        }

        // Busca o usuário pelo usuário cadastrado no ForgotPassword
        const user = await User.query().where('id', forgotObject!.userId).first()

        // Verifica se o usuário do token passado existe
        if (!user) {
            session.flash('formd', 'O usuário que você está tentando alterar não existe')
            return response.redirect('/login')
        }

        user!.password = request.input('password')
        await user?.save()

        forgotObject.used = true
        await forgotObject.save()

        session.flash('forms', 'Sua senha foi alterada com sucesso')
        return response.redirect('/login')
    }
}
