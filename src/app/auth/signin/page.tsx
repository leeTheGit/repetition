import SignInClient from './client'
import { getUserAuth } from '@/lib/auth/utils'
import { redirect } from 'next/navigation'

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''

export default async function SignInPage() {
    const auth = await getUserAuth()
    console.log(auth)
    if (auth.session) {
        // return redirect(`/`)
    }

    return (
        <main className="h-full w-full flex flex-col flex-wrap content-center justify-center dark:css-selector p-10">
            <SignInClient domain={PLATFORM_DOMAIN} subdomain={'pico'} />
        </main>
    )
}
