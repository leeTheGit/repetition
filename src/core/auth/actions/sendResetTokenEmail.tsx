import { mailSender } from '@/lib/email/mailSender'
import { ResetPasswordEmail } from '@/lib/email/templates/reset-password'

export const sendPasswordResetEmail = async (mailOptions:any) => {

    // const rendered = emailTempl.renderWithLayout(emailParams)
    const { data, error } = await mailSender(
        mailOptions, 
        <ResetPasswordEmail 
            token={mailOptions.data.token} 
            domain={mailOptions.data.domain}
            />
    )
}
