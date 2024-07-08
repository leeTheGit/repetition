import Repository from '@/core/user/Repository'
import { isError } from '@/core/types'
// import { logger } from '@/lib/logger'
import { deleteMedia } from '@/core/asset/actions/deleteMedia'
const repository = new Repository()

interface Props {
    storeId: string
    entityId: string
}

export const imageDelete = async (params: Props) => {
    const entity = await repository.fetchByUuid(params.entityId, {
        storeId: params.storeId,
    })
    if (isError(entity)) {
        return entity
    }

    if (entity.profileImageId === null) {
        return {
            error: 'No image to delete',
        }
    }

    const del = async () => {
        const Delete = await repository.update(params.entityId, {
            profileImageId: null,
        })
        if (isError(Delete)) {
            return {
                error: 'Image not deleted',
                status: 400,
            }
        }
        return {
            success: true,
        }
    }

    const imageDelete = deleteMedia(del, {
        storeId: params.storeId,
        assetId: entity.profileImageId,
        resourceId: params.entityId,
        resource: 'user',
    })

    return imageDelete
}
