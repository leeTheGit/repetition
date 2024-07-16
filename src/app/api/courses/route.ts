import { NextRequest } from 'next/server'
import Repository from '@/core/course/Repository'
import { isError } from '@/core/types'
import { apiInsertSchema, fetchParams } from '@/core/course/Validators'
import { fetchResponse } from '@/core/course/response/CourseDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@/lib/logger'

const repository = new Repository()

export const GET = apiHandler(get, { validator: fetchParams })
export const POST = apiHandler(post, { validator: apiInsertSchema })

async function get(
    req: NextRequest,
    { params }: { params: { storeId: string } },
    ctx: any
) {

    try {
        let input = {
            ...ctx.data,
        }
        if (ctx.data.withSubmissions) {
            input['userId'] = ctx.user.id
        }

        const Course = await repository.fetchAll(input)
        if (isError(Course)) {
            return Course
        }
        return HttpResponse(Course, fetchResponse)
    } catch (error) {
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
        const values = {
            ...ctx.data,
            organisationUuid: ctx.user.organisationUuid
        }
        const newEntity = await repository.create(values)
        if (isError(newEntity)) {
            return newEntity
        }

        return newEntity.toObject()
    } catch (error) {
        logger.info('[PRODUCT_POST]', error)
        return {
            error: 'Internal error',
        }
    }
}
