'use server'

import { redirect } from 'next/navigation'
import OrganisationRepository from '@/core/organisation/Repository'
import AuthTokenRepository from '@/core/auth/Repository'
import { insertSchema } from '@/core/organisation/Validators'
import UserRepository from '@/core/user/Repository'
import { isError } from '@/core/types'
import { getUserAuth, getSignupAuth } from '@/lib/auth/utils'
import { logger } from '@/lib/logger'
import { Slugify } from '@/lib/utils'
import { cookies } from 'next/headers'

interface ActionResult {
    error: string
}

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''
const organisationRepository = new OrganisationRepository()
const userRepository = new UserRepository()
const tokenRepository = new AuthTokenRepository()

export async function createTeam(
    _: any,
    formData: FormData
): Promise<ActionResult> {
    const user = await getSignupAuth()

    if (!user.session?.user.id) {
        return {
            error: 'Unauthorized',
        }
    }

    const name = formData.get('name')

    if (typeof name !== 'string' || name.length < 3 || name.length > 100) {
        return {
            error: 'Invalid account name',
        }
    }

    const orgData = {
        name,
        domain: Slugify(name),
        // databaseStrategy: "shared",
        // timezone: "UTC",
        // logo:null,
        // logoReverse:null,
    }

    const data = insertSchema.safeParse(orgData)
    if (!data.success) {
        return {
            error: 'Invalid account name',
        }
    }

    const created = await organisationRepository.create(data.data)
    if (isError(created) || !('uuid' in created)) {
        return {
            error: 'Error creating team',
        }
    }

    const update = await userRepository.update(user.session.user.id, {
        organisationUuid: created.uuid,
    })
    if (!update) {
        return {
            error: 'Error creating team',
        }
    }

    let protocol = process.env.NODE_ENV === 'development' ? 'http:' : 'https:'

    logger.info(
        `[CREATED TEAM] redirecting ${created.domain}.${PLATFORM_DOMAIN}`
    )

    return redirect(
        `${protocol}//${created.domain}.${PLATFORM_DOMAIN}?newaccount=true`
    )
}
