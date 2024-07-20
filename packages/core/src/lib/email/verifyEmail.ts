import { EmailTemplate } from './templates/emailConfirm'
import { mailSender } from '@repetition/core/lib/email/mailSender'

export const sendVerificationEmail = async (token: string, email: string) => {
    const confirmLink = `${process.env.PLATFORM_DOMAIN}/auth/new-verification?token=${token}`

    // const mailOptions = {
    //     from: 'Acme <onboarding@resend.dev>',
    //     to: [email],
    //     subject: 'Conform email',
    //     text: `Please go to this link in your browser: ${confirmLink}`,
    // }

    // const { data, error } = await mailSender(mailOptions, EmailTemplate())

    // if (error) {
    //     console.log(error)
    //     return false
    // }

    return true
}
