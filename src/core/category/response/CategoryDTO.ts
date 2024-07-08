import { CategoryEntity } from '@/core/category/Entity'

export const createResponse = (res: CategoryEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        lable: res.name,
        createdAt: res.createdAt,
    }
}

export const fetchResponse = (res: CategoryEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        slug: res.slug,
        storeUuid: res.storeUuid,
        parentId: res.parentId,
        createdAt: res.createdAt,
        billboard: {
            id: res.billboard?.id,
            uuid: res.billboardUuid,
            imageUrl: res.billboard ? res.billboard.imageUrl : null,
            label: res.billboard ? res.billboard.label : '',
        },
    }
}
