import Repository from '@repetition/core/user/Repository'
import { isError } from '@repetition/core/types'
// import { logger } from '@repetition/core/lib/logger'
import { deleteMedia } from '@repetition/core/asset/actions/deleteMedia'
const repository = new Repository()

interface Props {
    entityId: string
}

export const imageDelete = async (params: Props) => {
    const entity = await repository.fetchByUuid(params.entityId, { })
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
        assetId: entity.profileImageId,
        resourceId: params.entityId,
        resource: 'user',
    })

    return imageDelete
}
