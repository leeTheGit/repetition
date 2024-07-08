import { WithoutNullableKeys } from '@/core/types'
import { UserEntity } from '@/core/user/Entity'
import { fetchResponse as assetResponse } from '@/core/asset/response/AssetDTO'

export const fetchResponse = (res: UserEntity) => {
    let profileImage = null
    if (res.profileImage) {
        profileImage = assetResponse(res.profileImage)
    }

    return {
        id: res.id,
        uuid: res.uuid,
        storeUuid: res.storeUuid,
        organisationUuid: res.organisationUuid,
        username: res.username,
        firstname: res.firstname,
        lastname: res.lastname,
        email: res.email,
        status: res.status,
        profileImage: profileImage,
        isDeleted: res.isDeleted,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
    }
}

export type UserAPI = ReturnType<typeof fetchResponse>
export type UserAPIForm = WithoutNullableKeys<ReturnType<typeof fetchResponse>>
