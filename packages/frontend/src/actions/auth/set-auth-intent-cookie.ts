'use server'

import { cookies } from 'next/headers'
import { getUserAuth } from '@repetition/frontend/lib/auth/utils'

export async function setAuthIntentCookie(intent: string, domain: string) {
    const user = await getUserAuth()
    if (user.session?.user.id) {
        return {
            error: 'Current signed in',
        }
    }

    cookies().set({
        domain: '.localtest.me',
        name: 'auth-intent', 
        value: intent + ":" + domain,
        expires: Date.now() + 1 * 60 * 60 * 1000
    })
}

export async function deleteAuthIntentCookie() {
    cookies().delete('auth-intent')
}