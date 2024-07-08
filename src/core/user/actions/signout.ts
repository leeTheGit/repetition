'use server'

import { validateRequest } from '@/lib/auth/validate'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { lucia } from '@/lib/auth/auth'

interface ActionResult {
    error: string
}

export async function signout(): Promise<ActionResult> {
    const { session } = await validateRequest()
    if (!session) {
        return {
            error: 'Unauthorized',
        }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )

    return redirect('/')
}
