import { z } from 'zod'
import { Slugify } from '@/lib/utils'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { collection } from '@/lib/db/schema/schema'
import { WithoutNullableKeys } from '../types'

function transformer(schema: any, action?: string) {
    const result: any = {}

    if (action !== 'get') {
        if (!schema.slug && schema.name) {
            result['slug'] = Slugify(schema.name)
        }
    }

    return { ...schema, ...result }
}

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        storeId: z.string().uuid().optional(),
        productId: z.string().uuid().optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

export const fetchById = z.object({
    entityId: z.union([z.string().uuid(), z.string().min(3).max(100)]),
})

export const entitySchema = createSelectSchema(collection)
export type EntitySchema = z.infer<typeof entitySchema>

// Columns that the database adds automatically are omitted
export const insertSchema = createInsertSchema(collection).omit({
    id: true,
    uuid: true,
    createdAt: true,
    updatedAt: true,
})
export type InsertSchema = z.infer<typeof insertSchema>

// Columns that the server side API adds are omitted
export const apiInsertSchema = insertSchema
    .omit({
        storeUuid: true,
        organisationUuid: true,
        slug: true,
    })
    .transform((schema) => transformer(schema, 'post'))
export type ApiInsertSchema = z.infer<typeof apiInsertSchema>
export type FormSchema = WithoutNullableKeys<InsertSchema>

export const patchSchema = createInsertSchema(collection).partial()
export type PatchSchema = z.infer<typeof patchSchema>
