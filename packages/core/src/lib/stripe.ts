import Stripe from 'stripe'


export const stripe = (key: string) => {
    
    return new Stripe(key, {
        apiVersion: '2023-10-16',
        typescript: true,
    });

}