import * as React from 'react'

interface Props {
    orderNumber?: string
}

export const EmailTemplate = ({ orderNumber }: Props) => (
    <div>
        <h1>Thank you!</h1>
        <p>We have recieved your order and it is on it&apos;s way</p>
        <p>Order number: {orderNumber}</p>
    </div>
)
