'use server'
import { cookies } from 'next/headers'
import { lucia } from '@repetition/frontend/lib/auth/auth'
import { getUserAuth } from '@repetition/frontend/lib/auth/utils'

import { revalidatePath } from 'next/cache'

// const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''

export async function setAuthCookie() {
    
    const user = await getUserAuth()
    if (!user.session?.user.id) {
        return {
            error: 'Unauthorized',
        }
    }


    // When first signing up on apex domain, we create a platform wide session
    // using domain as .platform.com (notice the dot in front).  This allows us
    // to redirect to the user's chosen domain and remain logged in, however once
    // the user has chosen their domain, we invalidate the original session and
    // create a new one tied directly to their chosen sub domain.
    await lucia.invalidateSession(user.session.id)
    
    // create a new session cookie for the user's chosen subdomain
    const session = await lucia.createSession(user.session.user.id, {})
 
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )

    revalidatePath('/')
}
