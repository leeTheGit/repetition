import ResetPasswordClient  from './client'
import { getUserAuth } from '@repetition/frontend/lib/auth/utils'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
    const auth = await getUserAuth()
    if (auth.session) {
        return redirect(`/`)
    }

    return (
        <main className="h-full w-full flex flex-col flex-wrap content-center justify-center dark:css-selector p-10">
            <ResetPasswordClient />
        </main>
    )
}
