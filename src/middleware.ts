// middleware.js
import { NextResponse, NextRequest } from 'next/server'

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
    ],
}

export default async function middleware(req: NextRequest) {
    console.log('[MIDDLEWARE]: Start')
    const url = req.nextUrl
    const hostname = req.headers.get('host')
    // console.log("[MIDDLEWARE]", url);
    // console.log('[MIDDLEWARE]: method', req.method)
    if (!hostname) {
        return new Response(null, { status: 404 })
    }



    // console.log('[MIDDLEWARE]: Redirecting to pure root..', path)
    return NextResponse.next()
}
