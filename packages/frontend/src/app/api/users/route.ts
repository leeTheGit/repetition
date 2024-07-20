import { NextRequest } from 'next/server'
import Repository from '@repetition/core/user/Repository'
import { isError } from '@repetition/core/types'
import { apiInsertSchema, fetchParams } from '@repetition/core/user/Validators'
import { fetchResponse } from '@repetition/core/user/response/UserDto'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'

const repository = new Repository()
const name = 'Users'

export const GET = apiHandler(get, { validator: fetchParams })
export const POST = apiHandler(post, { validator: apiInsertSchema })

async function get(
    req: NextRequest,
    { params }: { params: { entityId: string } },
    ctx: any
) {
    try {
        const Entity = await repository.fetchAll({
            ...ctx.data,
            organisationId: ctx.store.organisationUuid,
        })

        if (isError(Entity)) {
            return Entity.error
        }

        return HttpResponse(Entity, fetchResponse)
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_GET]`, error)
        return {
            error: 'Internal error',
        }
    }
}

async function post(
    req: Request,
    { params }: { params: { storeId: string } },
    ctx: any
) {
    try {
        const Entity = await repository.create({
            storeUuid: params.storeId,
            username: ctx.username,
            firstname: ctx.data.firstame || null,
            lastname: ctx.data.lastname || null,
            email: ctx.data.email,
        })

        if (isError(Entity)) {
            return Entity
        }

        return Entity.toObject()
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_POST]`, error)
        return {
            error: 'Internal error',
        }
    }
}