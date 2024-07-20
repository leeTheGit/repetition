import { TokenEntity } from '@repetition/core/auth/Entity'
import { WithoutNullableKeys } from '@repetition/core/types'

// export const createResponse = (res: TokenEntity) => {
//   return {
//     id: res.id,
//     uuid: res.uuid,
//     label: res.label,
//     image: res.imageUrl,
//     createdAt: res.createdAt,
//   };
// };

export const fetchResponse = (res: TokenEntity) => {
    return {
        id: res.id,
        organisationUuid: res.organisationUuid,
        type: res.type,
        identifier: res.identifier,
        name: res.name,
        expiresAt: res.expiresAt,
        description: res.description,
        status: res.status,
        createdAt: res.createdAt,
    }
}

export type AuthTokenAPI = ReturnType<typeof fetchResponse>
export type AuthTokenAPIForm = WithoutNullableKeys<
    ReturnType<typeof fetchResponse>
>
