import { OrderEntity } from '@/core/order/Entity'


export const createResponse = (res: OrderEntity) => {

    return { 
        "id": res.id,
        "uuid": res.uuid,
        "isPaid": res.isPaid,
        "total": res.total,
        "phone": res.phone,
        "address": res.address,
        "storeUuid": res.storeUuid,
        "createdAt": res.createdAt
    }
}


export const fetchResponse = (res: OrderEntity) => {
    return { 
        "id": res.id,
        "uuid": res.uuid,
        "isPaid": res.isPaid,
        "total": res.total,
        "phone": res.phone,
        "address": res.address,
        "storeUuid": res.storeUuid,
        "createdAt": res.createdAt
    }
}