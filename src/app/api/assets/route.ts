import { NextRequest } from 'next/server'
import AssetRepository from '@/core/asset/AssetRepository'
import { isError } from '@/core/types'
import { postParams, fetchParams } from '@/core/asset/AssetValidators'
import { fetchResponse } from '@/core/asset/response/AssetDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@/lib/logger'

const Repository = new AssetRepository()

export const GET = apiHandler(get, { validator: fetchParams })
// export const POST = apiHandler(post, {validator: postParams});

// async function post(
//     req: NextRequest,
//     { params }: { params: {storeId: string}},
//     ctx:any
//     ) {

//     try {

//         const Billboard = await Repository.create({
//             storeUuid: params.storeId,
//             label: ctx.data.label,
//             content: null
//         })

//         if (isError(Billboard)) {
//             return {
//                 error: Billboard.error,
//             }
//         }

//         return Billboard.toObject();

//     } catch (error) {
//         return {
//             error: "Internal error",
//         }
//     }
// }

async function get(
    req: NextRequest,
    { params }: { params: { storeId: string } },
    ctx: any
) {
    try {
        const params = {
            ...ctx.data,
            storeId: ctx.store.uuid,
            organisationId: ctx.user.organisationUuid,
        }

        const Assets = await Repository.fetchAll(params)

        if (isError(Assets)) {
            return Assets
        }

        return HttpResponse(Assets, fetchResponse)
    } catch (error) {
        logger.info('[ASSETS_GET]', error)
        return {
            error: 'Internal error',
        }
    }
}
