import { DateTime } from 'luxon';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class EmailsController {
    /**
     * Envia um e-mail de verificação de e-mail
     * 
     * @param auth AuthContract
     * @param response ResponseContract
     * @param session SessionContract 
     * @returns Response
     */
    public async sendVerify({ auth, response, session }: HttpContextContract) {
        auth.user!.sendEmailVerification()

        session.flash('forms', 'O e-mail de verificação foi enviado!')
        return response.redirect().back()
    }

    /**
     * Confirma a verificação do e-mail
     * 
     * @param auth AuthContract
     * @param params postId
     * @param request RequestContract
     * @param response ResponseContract
     * @param session SessionContract 
     * @returns Response
     */
    public async confirmEmail({ auth, params, request, response, session }: HttpContextContract) {
        // Verifica se o e-mail ainda está válido(30 minutos de validade)
        if (request.hasValidSignature()) {
            const user = await User.findByOrFail('email', params.email)
            
            // Verifica se o e-mail ainda não foi verificado
            if (user.email_verified_at === null) {
                user.email_verified_at = DateTime.local()
                await user.save()

                session.flash('forms', 'Seu e-mail foi verificado com sucesso')
                if (auth.user) {
                    return response.redirect('/')
                }
                return response.redirect('/login')
            }

            session.flash('formd', 'O link que você utilizou é inválido')
            if (auth.user) {
                return response.redirect('/')
            }
            return response.redirect('/login')
        } else {
            session.flash('formd', 'O link que você utilizou é inválido')
            if (auth.user) {
                return response.redirect('/')
            }
            return response.redirect('/login')
        }

    }
}
