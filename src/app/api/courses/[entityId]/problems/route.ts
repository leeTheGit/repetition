import { NextRequest } from 'next/server'
import Repository from '@/core/problems/Repository'
import CourseRepository from '@/core/course/Repository'
import { isError, not } from '@/core/types'
import { apiInsertSchema, fetchParams } from '@/core/problems/Validators'
import { fetchResponse } from '@/core/problems/response/ProblemDTO'
import { HttpResponse, apiHandler, uuidRegex } from '@/lib'
import { logger } from '@/lib/logger'

const repository = new Repository()

export const GET = apiHandler(get, { validator: fetchParams })
export const POST = apiHandler(post, { validator: apiInsertSchema })

async function get(
    req: NextRequest,
    { params }: { params: { entityId: string } },
    ctx: any
) {
    try {

        let courseId = params.entityId

        if ( !( params.entityId.match(uuidRegex) )) {
            const courseRepository = new CourseRepository()
            const ok = await courseRepository.fetchByUuid(params.entityId)
            if (not(ok)) {
                return {
                    error: "Course not found"
                }
            }
            courseId = ok.uuid
        }


        let input = {
            ...ctx.data,
            courseId: courseId,
            userId: ctx.user.id,
            isArchived: false,
        }

       

        const Product = await repository.fetchAll(input)
        if (isError(Product)) {
            return Product
        }
        
        return HttpResponse(Product, fetchResponse)
    } catch (error) {
        return {
            error: 'Internal error',
        }
    }
}

async function post(
    req: Request,
    { params }: { params: { entityId: string } },
    ctx: any
) {
    try {
        const productValues = {
            ...ctx.data,
        }
        const newProduct = await repository.create(productValues)
        if (isError(newProduct)) {
            return newProduct
        }

        return newProduct.toObject()
    } catch (error) {
        logger.info('[PRODUCT_POST]', error)
        return {
            error: 'Internal error',
        }
    }
}
