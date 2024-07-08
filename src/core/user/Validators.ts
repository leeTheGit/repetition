import { z } from 'zod'
import { users } from '@/lib/db/schema/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { WithoutNullableKeys } from '@/core/types'

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        storeId: z.string().optional(),
        email: z.string().min(1).optional(),
        organisationId: z.string().uuid().optional(),
    })
    .optional()
// .transform((product) => transformer(product, 'get'));

export type FetchParams = z.infer<typeof fetchParams>

export const fetchByUuid = z.object({
    entityId: z.string().uuid(),
})

export const fetchByEmail = z.object({
    entityId: z.string().email().min(3).max(100),
})

// export const entitySchema = createSelectSchema(users);
export const entitySchema = createSelectSchema(users).merge(
    z.object({ data: z.any().nullable().optional() })
)

export type EntitySchema = z.infer<typeof entitySchema>

export const insertSchema = createInsertSchema(users)
    .omit({
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
    })
    .merge(z.object({ data: z.any().nullable().optional() }))
export type InsertSchema = z.infer<typeof insertSchema>
export const apiInsertSchema = insertSchema.omit({
    organisationUuid: true,
})

export const patchSchema = createInsertSchema(users).partial()

export type FormSchema = WithoutNullableKeys<InsertSchema>
