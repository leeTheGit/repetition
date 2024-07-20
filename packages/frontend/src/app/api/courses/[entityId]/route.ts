import Repository from '@repetition/core/course/Repository'
import { isError } from '@repetition/core/types'
import { patchSchema, fetchCourseUuid } from '@repetition/core/course/Validators'
import { HttpResponse, apiHandler, getZodErrors } from '@/lib'
import { fetchResponse } from '@repetition/core/course/response/CourseDTO'
import { uuidRegex } from '@repetition/core/lib'
import { logger } from '@repetition/core/lib/logger'

const repository = new Repository()
const name = 'Course'

export const GET = apiHandler(get)
export const PATCH = apiHandler(update, { validator: patchSchema })
export const DELETE = apiHandler(Delete)

async function get(
    req: Request,
    { params }: { params: { entityId: string } },
    ctx: any
) {
    let input
    try {
        if (!params.entityId) {
            return { error: `${name} id is required`, status: 400 }
        }
        let uuid = false
        if (params.entityId.match(uuidRegex)) {
            uuid = true
        }

        input = fetchCourseUuid.safeParse(params)


        if (!input.success) {
            return {
                error: JSON.stringify({ error: getZodErrors(input) }),
                status: 400,
            }
        }

        var Entity = await repository.fetchByUuid(params.entityId, {
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
    { params }: { params: { entityId: string } },
    ctx: any
) {
    try {
        const Entity = await repository.update(params.entityId, ctx.data)

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
    { params }: { params: { entityId: string } }
) {
    try {
        // const del = await repository.delete(params.entityId)

        // if (isError(del)) {
        //     logger.info(`[ERROR] [${name.toUpperCase()}_DELETE]`, del)
        //     return { error: del.error }
        // }

        // return `${name} deleted`
    } catch (error) {
        logger.info(`[ERROR] [${name.toUpperCase()}_DELETE]`, error)
        return {
            error: 'Internal error',
        }
    }
}
