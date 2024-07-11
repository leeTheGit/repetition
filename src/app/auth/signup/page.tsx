import SignUpPage from './client'
import { getUserAuth } from '@/lib/auth/utils'
import { redirect } from 'next/navigation'

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''

export default async function SignInPage() {
    const auth = await getUserAuth()
    if (auth.session) {
        return redirect(`/`)
    }
    return (
        <SignUpPage  />
    )
}
