import { CategoryEntity } from '@/core/category/Entity'

// export const createResponse = (res: CategoryEntity) => {
//     return {
//         id: res.id,
//         uuid: res.uuid,
//         lable: res.name,
//         createdAt: res.createdAt,
//     }
// }

export const fetchResponse = (res: CategoryEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        slug: res.slug,
        description: res.description,
        createdAt: res.createdAt,
    }
}
