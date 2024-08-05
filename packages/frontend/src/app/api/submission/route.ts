import { NextRequest } from 'next/server'
import Repository from '@repetition/core/submission/Repository'
import { not } from '@repetition/core/types'
import {
    insertSchema,
    apiInsertSchema,
    ApiInsertSchema,
    fetchParams,
    InsertSchema,
} from '@repetition/core/submission/Validators'
import { fetchResponse } from '@repetition/core/submission/response/SubmissionDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'

const repository = new Repository()
const name = 'Submission'

// export const GET = apiHandler(get, { validator: fetchParams })
export const POST = apiHandler(post, { validator: apiInsertSchema })

async function get(
    req: NextRequest,
    { params }: { params: { storeId: string } },
    ctx: any
) {
    try {
        const ok = await repository.fetchAll({
            ...ctx.data,
            storeId: params.storeId,
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
    {}: {},
    ctx: any
) {
    try {

        const data = {
            userUuid: ctx.user.id,
            problemUuid: ctx.data.problemUuid || null,
            grade: ctx.data.grade,
            note: ctx.data.note,
            solution: ctx.data.solution || null,
            submittedAt: new Date()
        }
        
        const ok = await repository.create(data)

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
