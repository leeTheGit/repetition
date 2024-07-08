import { RoleEntity } from '@/core/user/roles/Entity'
import { WithoutNullableKeys } from '@/core/types'

export const fetchResponse = (res: RoleEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        slug: res.slug,
        description: res.description,
        createdAt: res.createdAt,
    }
}

export type RoleAPI = ReturnType<typeof fetchResponse>
export type RoleAPIForm = WithoutNullableKeys<ReturnType<typeof fetchResponse>>
