'use server'

import { db } from '@repetition/core/lib/db'
import { ModelError } from '@repetition/core/types'
import AssetLogRepository from '@repetition/core/asset/log/Repository'
import S3Component from '@repetition/core/lib/aws/S3Component'
import { isError } from '@repetition/core/types'

type deleteFunction = () => Promise<ModelError | { success: boolean }>
interface Props {
    assetId: string
    resource: string
    resourceId: string
    resourceAttribute?: string
}

const logRepository = new AssetLogRepository()

export const deleteMedia = async (
    deleteFunction: deleteFunction,
    params: Props
) => {
    const s3 = new S3Component()
    // const result = await s3.deleteFile(key)

    const transaction = await db.transaction(async (tx) => {
        try {
            const deleted = await deleteFunction()

            if (isError(deleted)) {
                tx.rollback()
                return deleted
            }

            const removeFromLog = await logRepository.deleteByPrimary(
                params.assetId,
                params.resource,
                params.resourceId
            )
        } catch (error: any) {
            tx.rollback()
            console.log('error', error)
            return {
                error: error.message,
            }
        }

        return {
            success: true,
        }
    })

    if (isError(transaction)) {
        return transaction
    }
    return {
        success: true,
    }
}
