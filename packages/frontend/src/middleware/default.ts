import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";

export const defaultMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
    return async (req: NextRequest, _next: NextFetchEvent) => {
        console.log('[MIDDLEWARE]: Start')
        const url = req.nextUrl
        const hostname = req.headers.get('host')
        if (!hostname) {
            return new Response(null, { status: 404 })
        }
        return await next(req, _next);
    }
};




