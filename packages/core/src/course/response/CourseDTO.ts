import { CourseEntity } from '@repetition/core/course/Entity'
import { WithoutNullableKeys } from '@repetition/core/types'
import { fetchResponse as assetResponse } from '@repetition/core/asset/response/AssetDTO'


export const fetchResponse = (res: CourseEntity) => {

    let courseImage = null
    if (res.courseImage) {
        courseImage = assetResponse(res.courseImage)
    }

    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        slug: res.slug,
        status: res.status,
        description: res.description || '',
        courseImage,
        createdAt: res.createdAt,
    }
}


export type CourseAPI = ReturnType<typeof fetchResponse>
export type CourseAPIForm = WithoutNullableKeys<
    ReturnType<typeof fetchResponse>
>
