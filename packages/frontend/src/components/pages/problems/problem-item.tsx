'use client'

import { useState } from 'react'
// import { toast } from 'sonner'
import Overlay from '@/components/overlay'
import { useFetchQuery } from '@/hooks/use-query'
interface Props {
    // orders: OrderItemColumn[]
    courseId: string
    problem?: {
        slug:string
    }
}

// const resource = `orders`
// const subResource = `items`
// const name = 'Order'

export const ItemListing: React.FC<Props> = ({ courseId, problem }) => {
    const [loading, setLoading] = useState(false)
    // const [orders, setOrders] = useState<OrderItemColumn[]>([])

    // const entities = useFetchQuery<OrderItemAPIForm[]>(
    //     `${resource}/${orderUuid}/${subResource}`,
    //     storeId as string
    // )

    console.log('the problem data', problem)
    return (
        <>
            <div className="w-full justify-center">
                <div className="relative flex m-auto">
                    {loading && <Overlay />}
                    {problem?.slug}
                </div>
            </div>
        </>
    )
}
