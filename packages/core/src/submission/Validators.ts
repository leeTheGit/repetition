import { z } from 'zod'
import { Slugify } from '@repetition/core/lib/utils'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { submission } from '@repetition/core/lib/db/schema/schema'
import { WithoutNullableKeys } from '../types'


export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().gte(1).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        userId: z.string().uuid().optional(),
        problemId: z.string().uuid().optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

export const fetchById = z.object({
    entityId: z.union([z.string().uuid(), z.string().min(3).max(100)]),
})

export const entitySchema = createSelectSchema(submission)
export type EntitySchema = z.infer<typeof entitySchema>

// Columns that the database adds automatically are omitted
const baseInsertSchema = createInsertSchema(submission);
export const insertSchema = baseInsertSchema

export type InsertSchema = z.infer<typeof insertSchema>

// Columns that the server side API adds are omitted
export const apiInsertSchema = baseInsertSchema.omit({
    id: true,
    uuid: true,
    userUuid: true,
    createdAt: true,
    updatedAt: true,
}).merge(
    z.object({
        grade: z.coerce.number().min(0).max(5)
    })
)

export type ApiInsertSchema = z.infer<typeof apiInsertSchema>
export type FormSchema = WithoutNullableKeys<InsertSchema>

export const patchSchema = createInsertSchema(submission).partial()
export type PatchSchema = z.infer<typeof patchSchema>
