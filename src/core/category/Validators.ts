import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { category } from '@/lib/db/schema/schema'

import { Slugify } from '@/lib/utils'
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
        name: z.string().optional(),
        courseId: z.string().optional(),
        organisationUuid: z.string().uuid().optional()
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

export const fetchByUuid = z.object({
    entityId: z.string().uuid().or(z.string().min(3).max(100)),
})

export const entitySchema = createSelectSchema(category)
export type EntitySchema = z.infer<typeof entitySchema> 

// Columns that the database adds automatically are omitted
export const insertSchema = createInsertSchema(category, {
}).omit({
    id: true,
    uuid: true,
    createdAt: true,
    updatedAt: true,
})
export type InsertSchema = z.infer<typeof insertSchema>

// Columns that the server side API adds are omitted
export const apiInsertSchema = insertSchema
    .omit({
        slug: true,
    })
    .transform((schema) => transformer(schema, 'post'))
export type ApiInsertSchema = z.infer<typeof apiInsertSchema>
// export type FormSchema = WithoutNullableKeys<InsertSchema>
export type FormSchema = InsertSchema

export const patchSchema = createInsertSchema(category).partial()
export type PatchSchema = z.infer<typeof patchSchema>
