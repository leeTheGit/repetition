import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { assetLog } from '@/lib/db/schema/schema'
import { NoUndefinedField } from '@/core/types'

export const fetchParams = z
    .object({
        limit: z.coerce
            .number()
            .gte(1, { message: 'Must be a minumum of 1' })
            .lt(100, { message: 'Must be a maximum of 100' })
            .optional(),
        offset: z.coerce.number().optional(),
        organisation: z.string().optional(),
        storeId: z.string().uuid().optional(),
        organisationId: z.string().uuid().optional(),
        resource: z.string().optional(),
        mediaUuid: z.string().uuid().optional(),
    })
    .optional()

export type FetchParams = z.infer<typeof fetchParams>

// export const authUser = createSelectSchema(users).pick({ id: true, username: true, email: true});
// export const userValidator = createInsertSchema(users).omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

const baseEntitySchema = createSelectSchema(assetLog)
export const entitySchema = baseEntitySchema
export type EntitySchema = z.infer<typeof entitySchema>

export const basePostSchema = createInsertSchema(assetLog).omit({
    uuid: true,
    organisationUuid: true,
    storeUuid: true,
})

export type FormSchema = NoUndefinedField<z.infer<typeof basePostSchema>>

export const patchParams = basePostSchema.partial()
export type PatchParams = z.infer<typeof patchParams>
