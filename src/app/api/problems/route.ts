import { NextRequest } from 'next/server'
import Repository from '@/core/problems/Repository'
import { isError } from '@/core/types'
import { apiInsertSchema, fetchParams } from '@/core/problems/Validators'
import { fetchResponse } from '@/core/problems/response/ProblemDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@/lib/logger'
import { DynamoMapper } from '@/core/problems/mappers/dynamoMapper'

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
            isArchived: false,
        }
        if (ctx.data.withSubmissions) {
            input['withSubmissions'] = true
            input['userId'] = ctx.user.id
        }

        repository.mapper = DynamoMapper
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
    {  }: {  },
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
