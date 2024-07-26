'use server'

import { validateRequest } from '@repetition/frontend/lib/auth/validate'
import { lucia } from '@repetition/frontend/lib/auth/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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
