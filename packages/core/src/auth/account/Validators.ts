import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { accounts } from '@repetition/core/lib/db/schema/schema'
import { WithoutNullableKeys } from '@repetition/core/types'

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>



export const fetchById = z.object({
    entityId: z.coerce.number(),
})

export const entitySchema = createSelectSchema(accounts)
export type EntitySchema = z.infer<typeof entitySchema>

export const insertSchema = createInsertSchema(accounts).omit({
    id: true,
})
export type InsertSchema = z.infer<typeof insertSchema>


export const patchSchema = createInsertSchema(accounts).partial()

export type PatchSchema = z.infer<typeof patchSchema>

export type FormSchema = WithoutNullableKeys<InsertSchema>
