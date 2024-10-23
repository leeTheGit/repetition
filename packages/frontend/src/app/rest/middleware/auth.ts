import { createMiddleware } from 'hono/factory'
import type { sessionUser } from '@/lib/auth/utils'
import { headers } from 'next/headers'
import { getUserAuth, getTokenAuth } from '@/lib/auth/utils'

export const checkAuth  = createMiddleware<{Variables: {user: sessionUser}}>(async (c, next) => {
    let session = null
    let user = null
    
    const headersList = headers()

    // NOTE:  We should always require access to the subdomain for checking auth
    // tokens but for now we will allow skipping this check
    let orgDomain = headersList.get('x-forwarded-host')
    if (!orgDomain) {
        orgDomain = ''
    }

    ;({ session } = await getTokenAuth(orgDomain))
    if (session) {
        user = session
    }
    if (!session) {
        ;({ session } = await getUserAuth())
        if (session) {
            user = session.user
        }
    }

    if (!user) {
        c.res = new Response(`"Unauthenticated"`, { status: 401 })
        return c.res    
    }

    c.set('user', user)
    
    await next()
})