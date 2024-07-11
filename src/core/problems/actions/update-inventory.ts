import Respository from '@/core/order/Repository'
import { not } from '@/core/types'

const repository = new Respository()

export const updateInventory = (storeId: string, orderId: string) => {
    const order = repository.fetchByUuid(orderId, { storeId, withItems: true })
    if (not(order)) {
        console.log('Order not found', orderId)
        return {
            error: 'Order not found',
        }
    }

    console.log('Updating order quantityies', order)
}
