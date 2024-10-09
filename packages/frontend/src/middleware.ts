import { NextResponse, NextRequest } from 'next/server'
import { stackMiddleware } from "@/middleware/stackMiddleware";
// import { withAuthorization } from "@/middleware/withAuthorization";
import { defaultMiddleware } from "@/middleware/default";
import { withHeaders } from "@/middleware/withHeaders";

// const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN || ''

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

export default stackMiddleware([defaultMiddleware, withHeaders]);
// https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs