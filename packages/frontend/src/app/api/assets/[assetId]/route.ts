import { NextRequest } from 'next/server'
import AssetRepository from '@repetition/core/asset/AssetRepository'
import { isError } from '@repetition/core/types'
import { patchParams } from '@repetition/core/asset/AssetValidators'
import { HttpResponse, apiHandler } from '@/lib'
import { fetchResponse } from '@repetition/core/asset/response/AssetDTO'
import { logger } from '@repetition/core/lib/logger'

const Repository = new AssetRepository()

export const GET = apiHandler(get)
export const PATCH = apiHandler(patch, { validator: patchParams })
export const DELETE = apiHandler(Delete)

async function get(
    req: NextRequest,
    { params }: { params: { assetId: string } },
    user: any,
    ctx: any
) {
    try {
        if (!params.assetId) {
            return { error: 'Asset id is required', status: 400 }
        }

        const Asset = await Repository.fetchByUuid(params.assetId, {
            storeId: ctx.store.uuid,
            organisationId: user.organisationUuid,
        })

        if (isError(Asset)) {
            return {
                error: 'Asset not found',
                status: 404,
            }
        }

        const response = HttpResponse(Asset, fetchResponse)
        return response
    } catch (error) {
        logger.info('[ASSET_GET]', error)

        return {
            error: 'Internal error',
            status: 500,
        }
    }
}

async function patch(
    req: Request,
    { params }: { params: { storeId: string; assetId: string } },
    ctx: any
) {
    try {
        const Asset = await Repository.update(params.assetId, ctx.data)

        if (isError(Asset)) {
            return {
                error: Asset.error,
            }
        }

        return {
            data: Asset,
        }
    } catch (error) {
        logger.info('[ASSET_PATCH]', error)
        return {
            error: 'Internal error',
        }
    }
}

async function Delete(
    req: Request,
    { params }: { params: { storeId: string; assetId: string } }
) {
    try {
        const del = await Repository.delete(params.storeId, params.assetId)
        if (isError(del)) {
            logger.info('ERROR DELETING ASSET', del)
            return {
                error: del.error,
            }
        }

        return {
            data: 'Asset deleted',
        }
    } catch (error) {
        logger.info('[ASSET_DELETE]', error)
        return {
            error: 'Internal error',
        }
    }
}
