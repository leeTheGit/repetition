'use server'

import { verify } from '@repetition/core/lib/auth/hash'
import { cookies } from 'next/headers'
import { lucia } from '@repetition/core/lib/auth/auth'
import { redirect } from 'next/navigation'
import UserRepository from '@repetition/core/user/Repository'
import { isError } from '@repetition/core/types'

interface ActionResult {
    error: string
}

const userRepository = new UserRepository()

export async function signin(
    _: any,
    formData: FormData
): Promise<ActionResult> {
    const email = formData.get('email')
    if (!email || typeof email !== 'string') {
        return {
            error: 'Invalid email',
        }
    }

    const password = formData.get('password')
    if (
        typeof password !== 'string' ||
        password.length < 6 ||
        password.length > 255
    ) {
        return {
            error: 'Password must be between 6 and 255 characters',
        }
    }

    const existingUser = await userRepository.fetchByEmail_forAuth(email)
    if (isError(existingUser)) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid usernames from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid usernames.
        // However, valid usernames can be already be revealed with the signup page among other methods.
        // It will also be much more resource intensive.
        // Since protecting against this is none-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If usernames are public, you may outright tell the user that the username is invalid.

        return {
            error: 'Incorrect username or password',
        }
    }
    if (!existingUser.hashedPassword) {
        return {
            error: 'Incorrect username or password',
        }
    }

    const validPassword = await verify(
        existingUser.hashedPassword,
        password
    )

    if (!validPassword) {
        return {
            error: 'Incorrect username or password',
        }
    }

    const session = await lucia.createSession(existingUser.uuid, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )

    if (existingUser.organisationUuid === null) {
        return redirect(`http://${process.env.PLATFORM_DOMAIN}/`)
    }

    return redirect('/dashboard')
}
