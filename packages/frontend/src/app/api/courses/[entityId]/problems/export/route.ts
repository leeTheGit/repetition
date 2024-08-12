import { NextRequest } from 'next/server'
import { db } from '@repetition/core/lib/db'
import Repository from '@repetition/core/problems/Repository'
import CourseRepository from '@repetition/core/course/Repository'
import { isError, not } from '@repetition/core/types'
import { apiInsertSchema, fetchParams } from '@repetition/core/problems/Validators'
import { ExportResponse } from '@repetition/core/problems/response/ExportDTO'

import { JSONResponse, apiHandler, uuidRegex } from '@/lib'
import { logger } from '@repetition/core/lib/logger'

const repository = new Repository(db)

export const GET = apiHandler(get, { validator: fetchParams })

async function get(
    req: NextRequest,
    { params }: { params: { entityId: string } },
    ctx: any
) {
    try {
        console.log('getting data to export')
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

        return {
            _download: JSONResponse(Product, ExportResponse)
        }

    } catch (error) {
        return {
            error: 'Internal error',
        }
    }
}