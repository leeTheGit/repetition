import { EmailTemplate } from './templates/passwordResetConfirm'
import { mailSender } from '@repetition/core/lib/email/mailSender'

export const sendPasswordResetEmail = async (token: string, email: string) => {
    const confirmLink = `${process.env.PLATFORM_DOMAIN}/auth/new-password?token=${token}`

    const mailOptions = {
        from: ' <noreply@elcyen.com>',
        to: [email],
        subject: 'Conform email',
        text: `To reset your password navigate to this link in your browser: ${confirmLink}`,
    }

    const { data, error } = await mailSender(
        mailOptions,
        EmailTemplate({ confirmLink })
    )

    if (error) {
        console.log(error)
        return false
    }

    return true
}
