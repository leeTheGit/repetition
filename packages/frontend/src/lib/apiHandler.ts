import { NextRequest, NextResponse } from 'next/server'
import { getZodErrors } from '@repetition/core/lib'
import { isError } from '@repetition/core/types'
import { getUserAuth, getTokenAuth } from '@repetition/frontend/lib/auth/utils'
import { headers } from 'next/headers'

type Options = Partial<{
    validator: any
    storeCheck: boolean
    authCheck: boolean
}>

// https://kushm.dev/posts/nextjs-app-router-api-middleware
function apiHandler(handler: any, options?: Options) {

    let validator: any = null
    let authCheck = true
    if (options && options.validator) {
        validator = options.validator
    }
    if (options && typeof options.authCheck !== 'undefined') {
        authCheck = options.authCheck
    }

    return async (req: NextRequest, params: any) => {
        let user = null

        // Cookie or token based auth check
        if (authCheck) {
            user = await checkAuth()
            if (isError(user)) {
                return new NextResponse(`"Unauthenticated"`, { status: 401 })
            }
        }

        let input: { success: boolean; data: any } = { data: {}, success: true }
        let body
        if (validator) {
            try {
                let qparams: Record<string, string> = {}
                if (req.method === 'GET') {
                    req.nextUrl.searchParams.forEach((value, key) => {
                        qparams[key] = value
                    })
                    body = { ...params.params, ...qparams }
                } else {
                    body = await req.json()
                }
            } catch (e) {
                console.log('error', e)
                body = {}
            }

            input = validator.safeParse(body)
            if (!input.success) {
                console.log('error', getZodErrors(input))
                return new NextResponse(`"${getZodErrors(input)}"`, {
                    status: 400,
                })
            }
        }


        try {
            let statusCode = 200
            if (req.method === 'POST') {
                statusCode = 201
            }

            // route handler
            const response = await handler(req, params, {
                data: input.data,
                user,
            })
            let headers = {}
            if (
                response &&
                typeof response === 'object' &&
                'data' in response
            ) {
                if ('headers' in response) {
                    headers = response.headers
                    delete response.headers
                }

                return NextResponse.json(
                    {
                        status: 'success',
                        ...response,
                    },
                    {
                        status: statusCode,
                        ...headers,
                    }
                )
            } else {
                if (isError(response)) {
                    let code = 500
                    if (response.status) {
                        code = response.status
                    }

                    return new NextResponse(`\"${response.error}\"`, {
                        status: code,
                    })
                }

                return NextResponse.json(
                    {
                        status: 'success',
                        data: response,
                    },
                    { status: statusCode }
                )
            }
        } catch (err) {
            console.log(err)
        }
    }
}

async function checkAuth() {
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
        return {
            error: 'Unauthenticated',
        }
    }

    return user
}

export { apiHandler }
