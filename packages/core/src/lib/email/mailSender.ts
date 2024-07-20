import { ReactNode } from 'react'
import { Resource } from 'sst'

// import { EmailTemplate } from './templates/emailConfirm';
import { Resend } from 'resend'

interface mailSender {
    to: string | string[]
    subject: string
    from?: string
    text?: string
    html?: string
    react?: ReactNode
    data?: any
}

const resend = new Resend(Resource.ResendApiKey.value)

export const mailSender = async (
    props: mailSender,
    template: ReactNode | string
) => {
    const options: any = {
        from: props.from || 'Acme <onboarding@resend.dev>',
        to: props.to,
        subject: props.subject,
    }

    if (typeof template === 'string') {
        options.html = template
    } else {
        options.react = template
        if ('text' in props && props.text) {
            options.text = props.text as string
        }
    }

    return await resend.emails.send(options)
}
