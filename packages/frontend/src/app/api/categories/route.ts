import { NextRequest } from 'next/server'
import Repository from '@repetition/core/category/Repository'
import { not } from '@repetition/core/types'
import {
    apiInsertSchema,
    fetchParams,
    InsertSchema,
} from '@repetition/core/category/Validators'
import { fetchResponse } from '@repetition/core/category/response/CategoryDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'

const repository = new Repository()
const name = 'Categories'

export const GET = apiHandler(get, { validator: fetchParams })
export const POST = apiHandler(post, { validator: apiInsertSchema })

async function get(
    req: NextRequest,
    {  }: { },
    ctx: any
) {
    try {
        const ok = await repository.fetchAll({
            ...ctx.data,
        })

        if (not(ok)) {
            return ok.error
        }

        return HttpResponse(ok, fetchResponse)
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_GET]`, error)
        return {
            error: 'Internal error',
        }
    }
}

async function post(
    req: Request,
    {  }: { },
    ctx: any
) {
    try {
        const ok = await repository.create({
            name: ctx.data.name,
            slug: ctx.data.slug,
        })

        if (not(ok)) {
            return ok.error
        }

        return ok.toObject()
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_POST]`, error)
        return {
            error: 'Internal error',
        }
    }
}
