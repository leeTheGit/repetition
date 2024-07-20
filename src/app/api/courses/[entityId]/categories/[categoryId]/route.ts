import Repository from '@/core/category/Repository'
import { isError } from '@/core/types'
import { patchSchema, fetchByUuid } from '@/core/category/Validators'
import { HttpResponse, apiHandler, getZodErrors } from '@/lib'
import { fetchResponse } from '@/core/category/response/CategoryDTO'
import { uuidRegex } from '@/lib'
import { logger } from '@/lib/logger'

const repository = new Repository()
const name = 'Category'

export const GET = apiHandler(get)
export const PATCH = apiHandler(update, { validator: patchSchema })
export const DELETE = apiHandler(Delete)

async function get(
    req: Request,
    { params }: { params: { entityId: string, categoryId: string } },
    ctx: any
) {
    let input
    try {

        input = fetchByUuid.safeParse(params)

        if (!input.success) {
            return {
                error: JSON.stringify({ error: getZodErrors(input) }),
                status: 400,
            }
        }

        var Entity = await repository.fetchByUuid(params.categoryId, {
            courseId: params.entityId,
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
    { params }: { params: { entityId: string, categoryId: string} },
    ctx: any
) {
    try {
        const Entity = await repository.update(params.categoryId, ctx.data)

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
    { params }: { params: { entityId: string; categoryId: string } }
) {
    try {
        const del = await repository.delete(params.entityId, params.categoryId)

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
