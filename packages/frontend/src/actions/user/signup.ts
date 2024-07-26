'use server'

import { passwordHash } from '@repetition/frontend/lib/auth/hash'
import { cookies } from 'next/headers'
import { lucia } from '@repetition/frontend/lib/auth/auth'
import { redirect } from 'next/navigation'
import UserRepository from '@repetition/core/user/Repository'
import { isError } from '@repetition/core/types'
import { userValidator } from '@repetition/core/lib/db/schema/schema'
import { getZodErrors } from '@repetition/core/lib/utils'
import { logger } from '@repetition/core/lib/logger'


interface ActionResult {
    error: string
}

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''

const userRepository = new UserRepository()

export async function signup(
    _: any,
    formData: FormData
): Promise<ActionResult> {
    const email = formData.get('email')
    // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
    // keep in mind some database (e.g. mysql) are case insensitive
    if (typeof email !== 'string' || email.length < 3 || email.length > 31) {
        return {
            error: 'Invalid username',
        }
    }

    const password = formData.get('password')
    if (
        typeof password !== 'string' ||
        password.length < 6 ||
        password.length > 255
    ) {
        return {
            error: 'Invalid password',
        }
    }

    const existingUser = await userRepository.fetchByEmail(email)
    if (!isError(existingUser)) {
        return {
            error: 'User already exists',
        }
    }

    const hashedPassword = await passwordHash(password)


    const newUserData = userValidator.safeParse({
        email,
        username: 'frank',
    })

    if (!newUserData.success) {
        return {
            error: getZodErrors(newUserData),
        }
    }

    const newUser = await userRepository.create({
        ...newUserData.data,
        firstname: null,
        organisationUuid: null,
        storeUuid: null,
        lastname: null,
        status: 'active',
        profileImage: null,
        isDeleted: false,
        emailVerified: null,
        image: null,
        isTwoFactorEnabled: false,
        rememberToken: null,
        data: null,
        hashedPassword,
    })

    if (isError(newUser) || !('uuid' in newUser)) {
        return {
            error: 'Error creating user',
        }
    }
    const platformDomain = PLATFORM_DOMAIN.split(':')[0]
    var date = new Date()
    date.setTime(date.getTime() + 30 * 1000)

    const session = await lucia.createSession(newUser.uuid, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    sessionCookie.attributes.domain = `.${platformDomain}`
    sessionCookie.attributes.maxAge = 60 * 60
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    )
    return redirect('/dashboard')
}
