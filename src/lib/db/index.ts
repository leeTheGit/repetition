import { drizzle } from 'drizzle-orm/node-postgres'
import { Resource } from 'sst'

import { Client } from 'pg'
import { Pool } from 'pg'
import * as schema from './schema/schema'

const logger = process.env.IS_LOCAL ? true : false

declare global {
    var drizzle: Client | Pool
}
// console.log(process.env.DATABASE_URL);
// console.log(process.env.NODE_ENV)
// console.log(process.env.IS_LOCAL)
// export const client = new Client({
//     connectionString: process.env.DATABASE_URL,
// });

const databaseDSN = process.env.DATABASE_URL
// const databaseDSN = Resource.DatabaseDSN.value
// const databaseDSN = Resource.DatabaseDSN.value ||  process.env.DATABASE_URL
export const client =
    globalThis.drizzle ||
    new Pool({
        connectionString: databaseDSN,
        ssl: process.env.NODE_ENV === 'development' ? false : true,
    })

if (process.env.NODE_ENV !== 'production') {
    if (client) {
        globalThis.drizzle = client
    }
}

// let pool;
// let client;
// try {
//     // client = postgres(url);
//     if (!globalThis.drizzle) {
//         console.log("[DATABASE_CONNECTION] acutal connecting..." )
//         // pool = client.connect();
//     }
// } catch (e) {
//     console.log("Error connecting to db", e);
//     throw new Error("Error connecting to db");
// }

const db = drizzle(client, { schema, logger })
// console.log("[DATABASE_CONNECTION] DB:", db)

export { db }
