import { z } from 'zod'
import { Slugify } from '@repetition/core/lib/utils'
import { organisation } from '@repetition/core/lib/db/schema/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { WithoutNullableKeys } from '../types'

// function transformer(schema: any, action?: string) {
//     const result: any = {}

//     if (action !== 'get') {
//         if (!schema.domain && schema.name) {
//             result['domain'] = Slugify(schema.name)
//         }
//     }

//     return { ...schema, ...result }
// }

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        organisationUuid: z.string().uuid().optional(),
        storeUuid: z.string().uuid().optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

export const entitySchema = createSelectSchema(organisation)
export type EntitySchema = z.infer<typeof entitySchema>

export const insertSchema = createInsertSchema(organisation, {
    databaseStrategy: z.string().min(1).default('shared'),
    timezone: z.string().min(1).default('UTC'),
}).omit({
    id: true,
    uuid: true,
    createdAt: true,
    updatedAt: true,
})
// .transform((schema) => transformer(schema, 'post'));

export const patchSchema = createInsertSchema(organisation).partial()

export type InsertSchema = z.infer<typeof insertSchema>
export type FormSchema = WithoutNullableKeys<InsertSchema>
