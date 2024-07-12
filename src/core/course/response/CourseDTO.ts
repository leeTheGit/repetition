import { CourseEntity } from '@/core/course/Entity'
import { WithoutNullableKeys } from '@/core/types'



export const fetchResponse = (res: CourseEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        slug: res.slug,
        status: res.status,
        description: res.description || '',
        createdAt: res.createdAt,
    }
}


export type CourseAPI = ReturnType<typeof fetchResponse>
export type CourseAPIForm = WithoutNullableKeys<
    ReturnType<typeof fetchResponse>
>
