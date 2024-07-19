import Repository from '@/core/problems/Repository'
import { isError } from '@/core/types'
import { patchSchema, fetchProductUuid } from '@/core/problems/Validators'
import { HttpResponse, apiHandler, getZodErrors } from '@/lib'
import { fetchResponse } from '@/core/problems/response/ProblemDTO'
import { uuidRegex } from '@/lib'
import { logger } from '@/lib/logger'

const repository = new Repository()
const name = 'Problem'

export const GET = apiHandler(get)
export const PATCH = apiHandler(update, { validator: patchSchema })
export const DELETE = apiHandler(Delete)

async function get(
    req: Request,
    { params }: { params: { entityId: string, problemId: string } },
    ctx: any
) {
    let input
    try {
        if (!params.entityId) {
            return { error: `${name} id is required`, status: 400 }
        }
        logger.info('in the problem get route', params.problemId)
        let uuid = false
        if (params.entityId.match(uuidRegex)) {
            uuid = true
        }

        input = fetchProductUuid.safeParse(params)


        if (!input.success) {
            return {
                error: JSON.stringify({ error: getZodErrors(input) }),
                status: 400,
            }
        }

        var Entity = await repository.fetchByUuid(params.problemId, {
            course: params.entityId,
            organisationUuid: ctx.user.organisationUuid,
        })
        if (isError(Entity)) {
            return Entity
        }

        return HttpResponse(Entity, fetchResponse)
    } catch (error) {
        logger.info(`[${name.toUpperCase()}_GET]`, error)
        return {
            error: 'Internal error',
        }
    }
}

async function update(
    req: Request,
    { params }: { params: { entityId: string, problemId: string} },
    ctx: any
) {
    try {
        const Entity = await repository.update(params.problemId, ctx.data)

        if (isError(Entity)) {
            return Entity
        }

        return Entity
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_PATCH]`, error)
        return {
            error: 'Internal error',
        }
    }
}

async function Delete(
    req: Request,
    { params }: { params: { entityId: string; problemId: string } }
) {
    try {
        const del = await repository.delete(params.entityId, params.problemId)

        if (isError(del)) {
            logger.info(`[ERROR] [${name.toUpperCase()}_DELETE]`, del)
            return { error: del.error }
        }

        return `${name} deleted`
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_DELETE]`, error)
        return {
            error: 'Internal error',
        }
    }
}
