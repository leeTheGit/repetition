import { mailSender } from '@repetition/core/lib/email/mailSender'
import { ResetPasswordEmail } from '@repetition/core/lib/email/templates/reset-password'

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
