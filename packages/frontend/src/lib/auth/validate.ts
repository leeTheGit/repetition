import { cache } from 'react'
import { cookies, headers } from 'next/headers'
import type { Session, User } from 'lucia'
import type { TokenSession } from '@repetition/frontend/lib/auth/utils'
import { lucia } from './auth'
import AuthTokenRepository from '@repetition/core/auth/Repository'
import { isError } from '@repetition/core/types'
import { logger } from '@repetition/core/lib/logger'


type Signup = { user: User; session: Session } | { user: null; session: null }

const validReq = async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
    
    if (!sessionId) {
        return {
            user: null,
            session: null,
        }
    }
    const result = await lucia.validateSession(sessionId)
    
    // next.js throws when you attempt to set cookie when rendering page
    try {
        if (result.session && result.session.fresh) {

            const sessionCookie = lucia.createSessionCookie(result.session.id)
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }
        if (!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie()
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )
        }
    } catch(e: any) {
        console.log(e)
    }
    return result
}






const validToken = async (
    domain: string
): Promise<{ session: TokenSession } | { session: null }> => {
    const headersList = headers()
    const authorizationHeader = headersList.get('Authorization')
    const token = lucia.readBearerToken(authorizationHeader ?? '')

    if (!token) {
        return {
            session: null,
        }
    }
    const authTokenRepository = new AuthTokenRepository()

    const checkToken = await authTokenRepository.fetchByToken(token)

    if (isError(checkToken)) {
        return { session: null }
    }

    if ('expiresAt' in checkToken && checkToken.expiresAt) {
        if (Date.now() < checkToken.expiresAt.getTime()) {
            const checkToken = await authTokenRepository.deleteByToken(token)
            return { session: null }
        }
    }

    const session = {
        session: {
            organisationUuid: checkToken.organisationUuid,
            identity: checkToken.identifier,
            type: checkToken.type,
            name: checkToken.name,
            expiresAt: checkToken.expiresAt || null,
        },
    }

    return { session }
}

let validateRequest: () => Promise<Signup>
let validateToken: (domain:string) => Promise<{ session: TokenSession } | { session: null }>

// let validateRequest = null
// let validateToken = null
if ( typeof cache == 'function' ) { 
    validateRequest = cache(validReq)
    validateToken = cache(validToken)
} else {
    validateRequest = validReq;
    validateToken = validToken;
}

export { validateRequest, validateToken }
