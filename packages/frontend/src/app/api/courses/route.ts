import { NextRequest } from 'next/server'
import Repository from '@repetition/core/course/Repository'
import { isError } from '@repetition/core/types'
import { apiInsertSchema, fetchParams } from '@repetition/core/course/Validators'
import { fetchResponse } from '@repetition/core/course/response/CourseDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'

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
            userId: ctx.user.id,
            organisationUuid: ctx.user.organisationUuid
        }
        const newEntity = await repository.create(values)
        // console.log(newEntity)
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
